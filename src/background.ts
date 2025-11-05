import { addItem } from "./database"
import type { Item } from "./types"

// Create context menus
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: "pickquote-text", title: "拾句 → 存入灵感库", contexts: ["selection"] })
  chrome.contextMenus.create({ id: "pickquote-image", title: "拾句 → 保存带来源图片", contexts: ["image"] })
  chrome.contextMenus.create({ id: "pickquote-link", title: "拾句 → 仅存链接", contexts: ["link"] })
  chrome.contextMenus.create({ id: "pickquote-snapshot-image", title: "拾句 → 页面截图（可视区域）", contexts: ["page"] })
  // 长截图暂时移除
})

// Handle menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const url = info.pageUrl ?? tab?.url ?? ""
  const title = tab?.title ?? ""
  const site = url ? new URL(url).hostname : undefined

  const base = {
    source: { title, url, site },
    createdAt: Date.now()
  }

  if (info.menuItemId === "pickquote-text" && info.selectionText) {
    const content = info.selectionText
    const item: Item = {
      id: crypto.randomUUID(),
      type: "text",
      content,
      source: base.source,
      createdAt: base.createdAt
    }
    await addItem(item)
  }

  if (info.menuItemId === "pickquote-image" && info.srcUrl) {
    const item: Item = {
      id: crypto.randomUUID(),
      type: "image",
      content: info.srcUrl,
      source: base.source,
      createdAt: base.createdAt
    }
    await addItem(item)
  }

  if (info.menuItemId === "pickquote-link" && info.linkUrl) {
    const item: Item = {
      id: crypto.randomUUID(),
      type: "link",
      content: info.linkUrl,
      source: base.source,
      createdAt: base.createdAt
    }
    await addItem(item)
  }

  if (info.menuItemId === "pickquote-snapshot-image") {
    // capture visible area using chrome.tabs.captureVisibleTab
    const windowId = tab?.windowId
    chrome.tabs.captureVisibleTab(windowId, { format: "png" }, async (dataUrl) => {
      const err = chrome.runtime.lastError
      if (err) {
        console.warn("captureVisibleTab failed:", err.message)
        return
      }
      if (!dataUrl) return
      const item: Item = {
        id: crypto.randomUUID(),
        type: "snapshot",
        content: dataUrl,
        source: base.source,
        createdAt: base.createdAt
      }
      await addItem(item)
    })
  }
})

// Messages from content scripts for advanced capture
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.kind === "capture" && msg?.payload) {
    const item: Item = {
      id: crypto.randomUUID(),
      ...msg.payload,
      createdAt: Date.now()
    }
    addItem(item).then(() => sendResponse({ ok: true })).catch((e) => sendResponse({ ok: false, error: String(e) }))
    return true // async
  }
})

// Click on top bar extension icon opens management page
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage()
})
