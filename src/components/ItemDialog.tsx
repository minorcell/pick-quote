import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded"
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded"
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded"
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined"
import ImageRoundedIcon from "@mui/icons-material/ImageRounded"
import LinkRoundedIcon from "@mui/icons-material/LinkRounded"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography
} from "@mui/material"
import { useRef, useState } from "react"

import { exportToImage } from "../export"
import type { Item } from "../types"
import { prettyUrl } from "../utils"
import ShareCard from "./ShareCard"

export default function ItemDialog({
  item,
  open,
  onClose
}: {
  item: Item | null
  open: boolean
  onClose: () => void
}) {
  const shareCardRef = useRef<HTMLDivElement>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedTheme, setSelectedTheme] = useState<"dark" | "light">("dark")
  const [isExporting, setIsExporting] = useState(false)

  if (!item) return null
  const icon =
    item.type === "text" ? (
      <FormatQuoteRoundedIcon fontSize="small" />
    ) : item.type === "image" ? (
      <ImageRoundedIcon fontSize="small" />
    ) : item.type === "link" ? (
      <LinkRoundedIcon fontSize="small" />
    ) : (
      <ArticleRoundedIcon fontSize="small" />
    )

  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleExportImage = async (theme: typeof selectedTheme) => {
    setSelectedTheme(theme)
    handleCloseMenu()

    // 等待主题应用
    await new Promise((resolve) => setTimeout(resolve, 100))

    if (shareCardRef.current) {
      setIsExporting(true)
      try {
        const filename = `pickquote-${item.id.slice(0, 8)}-${Date.now()}`
        await exportToImage(shareCardRef.current, filename)
      } catch (error) {
        console.error("导出图片失败:", error)
        alert("导出图片失败，请重试")
      } finally {
        setIsExporting(false)
      }
    }
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            height: "85vh",
            display: "flex",
            bgcolor: "background.paper"
          }
        }
      }}>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
          py: 2.5,
          px: 3
        }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ color: "text.secondary", opacity: 0.7 }}>{icon}</Box>
          <Typography
            variant="subtitle1"
            component="span"
            sx={{ fontSize: "0.9rem", letterSpacing: "0.05em" }}>
            {item.type.toUpperCase()} ·{" "}
            {new Date(item.createdAt).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Tooltip title="导出为图片">
            <IconButton
              size="small"
              onClick={handleExportClick}
              disabled={isExporting}>
              <ImageOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="打开来源">
            <IconButton
              size="small"
              onClick={() => window.open(item.source.url, "_blank")}>
              <LinkRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}>
          <MenuItem onClick={() => handleExportImage("dark")}>
            深色主题
          </MenuItem>
          <MenuItem onClick={() => handleExportImage("light")}>
            浅色主题
          </MenuItem>
        </Menu>
      </DialogTitle>
      <DialogContent
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 4,
          py: 4,
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
          "&::-webkit-scrollbar": {
            width: "8px"
          },
          "&::-webkit-scrollbar-track": {
            bgcolor: "transparent"
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: (theme) =>
              theme.palette.mode === "light"
                ? "rgba(45, 52, 54, 0.2)"
                : "rgba(232, 230, 227, 0.2)",
            borderRadius: "4px",
            "&:hover": {
              bgcolor: (theme) =>
                theme.palette.mode === "light"
                  ? "rgba(45, 52, 54, 0.3)"
                  : "rgba(232, 230, 227, 0.3)"
            }
          }
        }}>
        <Box
          sx={{
            flex: 1,
            maxWidth: "680px",
            mx: "auto",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}>
          {item.type === "text" && (
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
                lineHeight: 2,
                textIndent: "2em",
                fontSize: "1.05rem",
                color: "text.primary",
                textAlign: "justify"
              }}>
              {item.content}
            </Typography>
          )}
          {item.type === "image" && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <img
                src={item.content}
                alt={item.source.title || prettyUrl(item.source.url)}
                style={{
                  maxWidth: "100%",
                  borderRadius: 12
                }}
              />
            </Box>
          )}
          {item.type === "link" && (
            <Typography variant="body1" sx={{ fontSize: "1rem" }}>
              <Link
                href={item.content}
                target="_blank"
                rel="noreferrer"
                underline="hover"
                sx={{ color: "primary.main" }}>
                {prettyUrl(item.content)}
              </Link>
            </Typography>
          )}
          {item.type === "snapshot" &&
            (typeof item.content === "string" &&
            item.content.startsWith("data:image") ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <img
                  src={item.content}
                  alt={item.source.title || prettyUrl(item.source.url)}
                  style={{
                    maxWidth: "100%",
                    borderRadius: 12
                  }}
                />
              </Box>
            ) : (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                长截图（合成）已保存
              </Typography>
            ))}
          {item.context?.paragraph && (
            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: "1px solid",
                borderColor: "divider"
              }}>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                  mb: 1.5,
                  display: "block"
                }}>
                所在段落
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.9,
                  color: "text.secondary",
                  fontSize: "0.9rem"
                }}>
                {item.context.paragraph}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
        <Box
          sx={{
            flex: 1,
            mr: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontSize: "0.75rem",
              display: "inline"
            }}>
            来源：
          </Typography>
          <Link
            href={item.source.url}
            target="_blank"
            rel="noreferrer"
            underline="hover"
            sx={{
              color: "primary.main",
              ml: 0.5,
              fontSize: "0.75rem"
            }}>
            {item.source.title || prettyUrl(item.source.url)}
          </Link>
        </Box>
        <Button onClick={onClose} sx={{ px: 3, flexShrink: 0 }}>
          关闭
        </Button>
      </DialogActions>

      {/* 隐藏的分享卡片，用于导出 */}
      <Box
        sx={{
          position: "fixed",
          top: -10000,
          left: -10000,
          zIndex: -1
        }}>
        <ShareCard ref={shareCardRef} item={item} theme={selectedTheme} />
      </Box>
    </Dialog>
  )
}
