/**
 * Long screenshot utility - captures full page and triggers direct download
 */

export interface CaptureOptions {
  format?: 'png' | 'jpeg'
  quality?: number
}

/**
 * Capture the entire page as a long screenshot
 * This function scrolls through the page, captures segments, and stitches them together
 */
export async function captureFullPage(options: CaptureOptions = {}): Promise<string> {
  const format = options.format || 'png'
  const quality = options.quality || 0.92

  // Get the full page dimensions
  const body = document.body
  const html = document.documentElement
  const pageWidth = Math.max(
    body.scrollWidth,
    body.offsetWidth,
    html.clientWidth,
    html.scrollWidth,
    html.offsetWidth
  )
  const pageHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  )

  // Store original scroll position
  const originalScrollX = window.scrollX
  const originalScrollY = window.scrollY

  // Create canvas to draw the full page
  const canvas = document.createElement('canvas')
  canvas.width = pageWidth
  canvas.height = pageHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }

  // Viewport dimensions
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  try {
    // Capture the page in segments
    const segments: { x: number; y: number; dataUrl: string }[] = []

    for (let y = 0; y < pageHeight; y += viewportHeight) {
      for (let x = 0; x < pageWidth; x += viewportWidth) {
        // Scroll to position
        window.scrollTo(x, y)

        // Wait for rendering
        await new Promise(resolve => setTimeout(resolve, 100))

        // Capture this segment via message to background script
        const dataUrl = await captureVisibleTab()
        segments.push({ x, y, dataUrl })
      }
    }

    // Stitch segments together
    for (const segment of segments) {
      const img = await loadImage(segment.dataUrl)
      ctx.drawImage(img, segment.x, segment.y)
    }

    // Convert to data URL
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg'
    return canvas.toDataURL(mimeType, quality)
  } finally {
    // Restore original scroll position
    window.scrollTo(originalScrollX, originalScrollY)
  }
}

/**
 * Request background script to capture visible tab
 */
function captureVisibleTab(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { kind: 'capture-visible-tab' },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
        } else if (response?.dataUrl) {
          resolve(response.dataUrl)
        } else {
          reject(new Error('Failed to capture visible tab'))
        }
      }
    )
  })
}

/**
 * Load image from data URL
 */
function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = dataUrl
  })
}

/**
 * Trigger download of the screenshot
 */
export function downloadScreenshot(dataUrl: string, filename?: string) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename || `screenshot-${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
