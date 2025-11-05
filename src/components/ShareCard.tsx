import { Box, Stack, Typography } from "@mui/material"
import { forwardRef } from "react"
import type { Item } from "../lib/types"
import { prettyUrl } from "../lib/utils"

interface ShareCardProps {
  item: Item
  theme?: "dark" | "light"
}

/**
 * ShareCard - 用于生成文艺风格的分享卡片
 * 支持多种主题，优雅的排版设计
 */
const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ item, theme = "dark" }, ref) => {
    // 主题配色方案
    const themes = {
      dark: {
        background: "#1a1a2e",
        text: "#eee",
        secondary: "rgba(238, 238, 238, 0.75)",
        accent: "rgba(255, 255, 255, 0.15)"
      },
      light: {
        background: "#f8f9fa",
        text: "#2d3436",
        secondary: "rgba(45, 52, 54, 0.7)",
        accent: "rgba(0, 0, 0, 0.08)"
      }
    }

    const currentTheme = themes[theme]
    const maxLength = 280 // 最大文本长度

    // 截断长文本
    const truncateText = (text: string, max: number) => {
      if (text.length <= max) return text
      return text.slice(0, max) + "..."
    }

    return (
      <Box
        ref={ref}
        sx={{
          width: 800,
          minHeight: 600,
          background: currentTheme.background,
          padding: "60px 80px",
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Noto Serif SC', 'Songti SC', serif"
        }}>
        {/* 装饰性引号 - 左上 */}
        <Box
          sx={{
            position: "absolute",
            top: 30,
            left: 30,
            fontSize: "120px",
            fontFamily: "Georgia, serif",
            color: currentTheme.accent,
            lineHeight: 1,
            opacity: 0.4
          }}>
          "
        </Box>

        {/* 装饰性引号 - 右下 */}
        <Box
          sx={{
            position: "absolute",
            bottom: 30,
            right: 30,
            fontSize: "120px",
            fontFamily: "Georgia, serif",
            color: currentTheme.accent,
            lineHeight: 1,
            opacity: 0.4,
            transform: "rotate(180deg)"
          }}>
          "
        </Box>

        {/* 主要内容区域 */}
        <Stack
          spacing={4}
          sx={{
            position: "relative",
            zIndex: 1,
            minHeight: 480,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
          {/* 内容主体 */}
          <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
            {item.type === "text" ? (
              <Typography
                sx={{
                  fontSize: "32px",
                  lineHeight: 2,
                  color: currentTheme.text,
                  fontWeight: 400,
                  letterSpacing: "0.05em",
                  textAlign: "justify",
                  textIndent: "2em",
                  wordBreak: "break-word",
                  fontFamily: "'Noto Serif SC', 'Songti SC', serif"
                }}>
                {truncateText(item.content, maxLength)}
              </Typography>
            ) : item.type === "image" ? (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                <img
                  src={item.content}
                  alt="content"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    borderRadius: "12px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.15)"
                  }}
                />
              </Box>
            ) : item.type === "snapshot" &&
              typeof item.content === "string" &&
              item.content.startsWith("data:image") ? (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                <img
                  src={item.content}
                  alt="snapshot"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    borderRadius: "12px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.15)"
                  }}
                />
              </Box>
            ) : (
              <Typography
                sx={{
                  fontSize: "28px",
                  lineHeight: 1.8,
                  color: currentTheme.text,
                  fontWeight: 400,
                  letterSpacing: "0.05em",
                  fontFamily: "'Noto Serif SC', 'Songti SC', serif"
                }}>
                {truncateText(item.content, maxLength)}
              </Typography>
            )}
          </Box>

          {/* 分隔线 */}
          <Box
            sx={{
              height: "1px",
              background: currentTheme.accent,
              width: "60%",
              margin: "0 auto"
            }}
          />

          {/* 底部信息 */}
          <Stack spacing={1.5} alignItems="center">
            <Typography
              sx={{
                fontSize: "18px",
                color: currentTheme.secondary,
                fontWeight: 300,
                letterSpacing: "0.03em",
                textAlign: "center",
                fontFamily: "'Noto Serif SC', 'Songti SC', serif"
              }}>
              {item.source.title || prettyUrl(item.source.url)}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                color: currentTheme.accent,
                fontWeight: 300,
                letterSpacing: "0.08em",
                fontFamily: "'SF Pro Text', -apple-system, sans-serif"
              }}>
              {new Date(item.createdAt).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </Typography>
          </Stack>

          {/* 品牌标识 */}
          <Box
            sx={{
              position: "absolute",
              bottom: -30,
              right: -40,
              opacity: 0.6
            }}>
            <Typography
              sx={{
                fontSize: "16px",
                color: currentTheme.secondary,
                fontWeight: 300,
                letterSpacing: "0.15em",
                fontFamily: "'Noto Serif SC', 'Songti SC', serif"
              }}>
              拾句 · 灵感捕手
            </Typography>
          </Box>
        </Stack>
      </Box>
    )
  }
)

ShareCard.displayName = "ShareCard"

export default ShareCard
