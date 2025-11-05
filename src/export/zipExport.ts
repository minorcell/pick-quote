import JSZip from "jszip"

import type { Item } from "../types"

function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, content] = dataUrl.split(",")
  const mime = /data:(.*?);base64/.exec(meta)?.[1] || "image/png"
  const bin = atob(content)
  const arr = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
  return new Blob([arr], { type: mime })
}

export async function toZip(items: Item[]): Promise<Blob> {
  const zip = new JSZip()
  const mdLines: string[] = []

  for (const it of items) {
    let assetPath = ""
    if ((it.type === "image" || it.type === "snapshot") && typeof it.content === "string" && it.content.startsWith("data:image")) {
      const filename = `images/${it.hash || `${Date.now()}-${Math.random().toString(16).slice(2)}`}.png`
      const blob = dataUrlToBlob(it.content)
      zip.file(filename, blob)
      assetPath = filename
    }

    const content = (it.type === "image" || it.type === "snapshot") && assetPath
      ? `![snapshot](${assetPath})`
      : it.content.replace(/\n/g, " ")
    const source = `(${it.source.title || it.source.url})`
    mdLines.push(`- ${content} ${source}`)
  }

  zip.file("export.md", mdLines.join("\n"))
  const blob = await zip.generateAsync({ type: "blob" })
  return blob
}
