import type { PlasmoCSConfig } from "plasmo"
import { captureFullPage, downloadScreenshot } from "~lib/longScreenshot"

export const config: PlasmoCSConfig = {
  matches: ["https://*/*", "http://*/*"],
  all_frames: true
}

// Simple selection feedback: show a small toast when saved
function showToast(text: string) {
  const toast = document.createElement("div")
  toast.textContent = text
  toast.style.position = "fixed"
  toast.style.zIndex = "2147483647"
  toast.style.bottom = "24px"
  toast.style.right = "24px"
  toast.style.background = "rgba(0,0,0,0.8)"
  toast.style.color = "#fff"
  toast.style.padding = "8px 12px"
  toast.style.borderRadius = "8px"
  toast.style.fontSize = "12px"
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 2000)
}

// Keyboard shortcut handler (fallback if commands not available)
document.addEventListener("keydown", (e) => {
  const isSave = e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "s"
  if (!isSave) return
  const sel = window.getSelection()?.toString().trim()
  if (!sel) return
  chrome.runtime.sendMessage(
    {
      kind: "capture",
      payload: {
        type: "text",
        content: sel,
        context: deriveContext(),
        anchor: deriveAnchor(),
        source: {
          title: document.title,
          url: location.href,
          site: location.hostname
        }
      }
    },
    (res) => {
      if (res?.ok) showToast("已保存到拾句")
    }
  )
})

// Listen for background command to request selection
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.kind === "request-selection") {
    const sel = window.getSelection()?.toString().trim()
    if (!sel) {
      sendResponse({ ok: false })
      return
    }
    chrome.runtime.sendMessage(
      {
        kind: "capture",
        payload: {
          type: "text",
          content: sel,
          context: deriveContext(),
          anchor: deriveAnchor(),
          source: {
            title: document.title,
            url: location.href,
            site: location.hostname
          }
        }
      },
      (res) => {
        if (res?.ok) showToast("已保存到拾句")
        sendResponse({ ok: true })
      }
    )
    return true
  }

  // Handle long screenshot request
  if (msg?.kind === "capture-long-screenshot") {
    showToast("正在生成长截图...")
    captureFullPage()
      .then((dataUrl) => {
        const filename = `long-screenshot-${document.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.png`
        downloadScreenshot(dataUrl, filename)
        showToast("长截图已下载")
        sendResponse({ ok: true })
      })
      .catch((error) => {
        console.error("Failed to capture long screenshot:", error)
        showToast("长截图生成失败")
        sendResponse({ ok: false, error: String(error) })
      })
    return true
  }
})

function deriveContext() {
  const selection = document.getSelection()
  if (!selection || selection.rangeCount === 0) return undefined
  const range = selection.getRangeAt(0)
  const paragraph = range?.commonAncestorContainer?.textContent || ""
  const text = selection.toString()
  const before = paragraph.slice(Math.max(0, paragraph.indexOf(text) - 10), paragraph.indexOf(text))
  const after = paragraph.slice(paragraph.indexOf(text) + text.length, paragraph.indexOf(text) + text.length + 10)
  return { before, after, paragraph }
}

function deriveAnchor() {
  const selection = document.getSelection()
  if (!selection || selection.rangeCount === 0) return undefined
  const node = selection.anchorNode as Element | null
  const el = node?.nodeType === Node.ELEMENT_NODE ? (node as Element) : node?.parentElement
  if (!el) return undefined
  return getCssSelector(el)
}

function getCssSelector(el: Element): string {
  if (el.id) return `#${el.id}`
  const parts: string[] = []
  let cur: Element | null = el
  while (cur && cur.nodeType === Node.ELEMENT_NODE && parts.length < 5) {
    const tag = cur.tagName.toLowerCase()
    const cls = (cur.className || "")
      .toString()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((c) => `.${c}`)
      .join("")
    let nth = 1
    let sib = cur
    while ((sib = sib.previousElementSibling as Element | null)) {
      if (sib.tagName === cur.tagName) nth++
    }
    parts.unshift(`${tag}${cls}:nth-of-type(${nth})`)
    cur = cur.parentElement
  }
  return parts.join(" > ")
}
