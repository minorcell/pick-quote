import type { Item, SearchQuery } from "./types"
import { computeItemHash } from "./utils"

const DB_NAME = "pickquote-db"
const DB_VERSION = 2

type TableNames = "items" | "categories" | "sources"

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains("items")) {
        const store = db.createObjectStore("items", { keyPath: "id" })
        store.createIndex("type", "type", { unique: false })
        store.createIndex("createdAt", "createdAt", { unique: false })
        store.createIndex("sourceSite", "sourceSite", { unique: false })
        store.createIndex("categoryId", "categoryId", { unique: false })
        store.createIndex("hash", "hash", { unique: false })
      } else {
        // migrate: remove tags index if exists
        try {
          const tx = req.transaction as IDBTransaction
          const store = tx.objectStore("items")
          if (store.indexNames && (store.indexNames as any).contains?.("tags")) {
            store.deleteIndex("tags")
          }
        } catch {}
      }
      // stub other stores for future
      if (!db.objectStoreNames.contains("categories")) {
        const cs = db.createObjectStore("categories", { keyPath: "id" })
        cs.createIndex("name", "name", { unique: true })
      }
      // tags store removed in v2 migration
      if (!db.objectStoreNames.contains("sources")) {
        db.createObjectStore("sources", { keyPath: "site" })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function withStore<T>(name: TableNames, mode: IDBTransactionMode, fn: (store: IDBObjectStore) => Promise<T> | T): Promise<T> {
  const db = await openDb()
  const tx = db.transaction(name, mode)
  const store = tx.objectStore(name)
  const result = await fn(store)
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
  db.close()
  return result
}

export async function addItem(item: Item): Promise<void> {
  const normalized: Item = {
    ...item,
    sourceSite: item.source.site ?? new URL(item.source.url).hostname,
    hash: item.hash || (await computeItemHash(item.content, item.source.url))
  }
  // simple de-dup: if hash exists for same url, skip
  const exists = await withStore("items", "readonly", async (store) => {
    const idx = store.index("hash")
    return new Promise<boolean>((resolve, reject) => {
      const req = idx.get(normalized.hash)
      req.onsuccess = () => {
        const val = req.result as Item | undefined
        resolve(Boolean(val && val.source?.url === normalized.source.url))
      }
      req.onerror = () => reject(req.error)
    })
  })
  if (exists) return

  await withStore("items", "readwrite", (store) => {
    store.put(normalized)
  })
}

export async function getRecent(limit = 10): Promise<Item[]> {
  return withStore("items", "readonly", async (store) => {
    const idx = store.index("createdAt")
    const items: Item[] = []
    return new Promise<Item[]>((resolve, reject) => {
      const cursorReq = idx.openCursor(null, "prev")
      cursorReq.onsuccess = () => {
        const cursor = cursorReq.result
        if (cursor && items.length < limit) {
          items.push(cursor.value as Item)
          cursor.continue()
        } else {
          resolve(items)
        }
      }
      cursorReq.onerror = () => reject(cursorReq.error)
    })
  })
}

export async function searchItems(q: SearchQuery): Promise<Item[]> {
  return withStore("items", "readonly", async (store) => {
    const results: Item[] = []
    return new Promise<Item[]>((resolve, reject) => {
      const idx = store.index("createdAt")
      const cursorReq = idx.openCursor(null, "prev")
      cursorReq.onsuccess = () => {
        const cursor = cursorReq.result
        if (!cursor) {
          resolve(results)
          return
        }
        const item = cursor.value as Item
        if (
          (!q.type || item.type === q.type) &&
          (!q.site || item.sourceSite === q.site) &&
          (!q.from || item.createdAt >= q.from) &&
          (!q.to || item.createdAt <= q.to) &&
          (!q.categoryId || item.categoryId === q.categoryId) &&
          (!q.keyword || (item.content?.toLowerCase().includes(q.keyword.toLowerCase()) || item.source.title?.toLowerCase().includes(q.keyword.toLowerCase())))
        ) {
          results.push(item)
        }
        cursor.continue()
      }
      cursorReq.onerror = () => reject(cursorReq.error)
    })
  })
}

export async function updateItem(item: Item): Promise<void> {
  await withStore("items", "readwrite", (store) => {
    store.put(item)
  })
}

export async function listCategories(): Promise<{ id: string; name: string }[]> {
  return withStore("categories", "readonly", async (store) => {
    const all: { id: string; name: string }[] = []
    return new Promise((resolve, reject) => {
      const req = store.openCursor()
      req.onsuccess = () => {
        const c = req.result
        if (c) {
          all.push(c.value)
          c.continue()
        } else resolve(all)
      }
      req.onerror = () => reject(req.error)
    })
  })
}

export async function upsertCategory(cat: { id: string; name: string }): Promise<void> {
  await withStore("categories", "readwrite", (store) => {
    store.put(cat)
  })
}

export async function deleteCategory(id: string): Promise<void> {
  await withStore("categories", "readwrite", (store) => {
    store.delete(id)
  })
}

export async function deleteItem(id: string): Promise<void> {
  await withStore("items", "readwrite", (store) => {
    store.delete(id)
  })
}

export async function exportItems(): Promise<Item[]> {
  return withStore("items", "readonly", async (store) => {
    const all: Item[] = []
    return new Promise<Item[]>((resolve, reject) => {
      const cursorReq = store.openCursor()
      cursorReq.onsuccess = () => {
        const cursor = cursorReq.result
        if (cursor) {
          all.push(cursor.value as Item)
          cursor.continue()
        } else {
          resolve(all)
        }
      }
      cursorReq.onerror = () => reject(cursorReq.error)
    })
  })
}
