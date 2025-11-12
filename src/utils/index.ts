export async function sha256(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input)
  const hashBuffer = await crypto.subtle.digest("SHA-256", enc)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

export async function computeItemHash(
  content: string,
  url: string
): Promise<string> {
  return sha256(`${url}|${content}`)
}

export function prettyUrl(url: string): string {
  try {
    const u = new URL(url)
    const host = u.hostname
    let path = u.pathname
    if (path === "/") path = ""
    const shortPath = path.length > 32 ? path.slice(0, 32) + "…" : path
    return shortPath ? `${host}${shortPath}` : host
  } catch {
    return url
  }
}
