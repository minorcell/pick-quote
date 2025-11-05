import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, Link, Box, IconButton, Tooltip, Menu, MenuItem } from "@mui/material"
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded"
import ImageRoundedIcon from "@mui/icons-material/ImageRounded"
import LinkRoundedIcon from "@mui/icons-material/LinkRounded"
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded"
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded"
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded"
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined"
import { useRef, useState } from "react"
import type { Item } from "../lib/types"
import { prettyUrl } from "../lib/utils"
import ShareCard from "./ShareCard"
import { exportToImage } from "../lib/imageExport"

export default function ItemDialog({ item, open, onClose }: { item: Item | null; open: boolean; onClose: () => void }) {
  const shareCardRef = useRef<HTMLDivElement>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedTheme, setSelectedTheme] = useState<"gradient1" | "gradient2" | "gradient3" | "dark" | "light">("gradient1")
  const [isExporting, setIsExporting] = useState(false)

  if (!item) return null
  const created = new Date(item.createdAt).toLocaleString()
  const icon =
    item.type === "text"
      ? <FormatQuoteRoundedIcon fontSize="small" />
      : item.type === "image"
      ? <ImageRoundedIcon fontSize="small" />
      : item.type === "link"
      ? <LinkRoundedIcon fontSize="small" />
      : <ArticleRoundedIcon fontSize="small" />

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
    await new Promise(resolve => setTimeout(resolve, 100))

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
      PaperProps={{
        sx: {
          borderRadius: 2,
          height: "80vh",
          display: "flex"
        }
      }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          {icon}
          <Typography variant="subtitle1" component="span">
            {item.type.toUpperCase()} · {created}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Tooltip title="导出为图片">
            <IconButton size="small" onClick={handleExportClick} disabled={isExporting}>
              <ImageOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="打开来源">
            <IconButton size="small" onClick={() => window.open(item.source.url, "_blank") }>
              <OpenInNewRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="复制链接">
            <IconButton size="small" onClick={() => navigator.clipboard.writeText(item.source.url)}>
              <ContentCopyRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => handleExportImage("gradient1")}>紫色渐变</MenuItem>
          <MenuItem onClick={() => handleExportImage("gradient2")}>粉色渐变</MenuItem>
          <MenuItem onClick={() => handleExportImage("gradient3")}>蓝色渐变</MenuItem>
          <MenuItem onClick={() => handleExportImage("dark")}>深色主题</MenuItem>
          <MenuItem onClick={() => handleExportImage("light")}>浅色主题</MenuItem>
        </Menu>
      </DialogTitle>
      <DialogContent dividers sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        <Stack spacing={2}>
          {item.type === "text" && (
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
              {item.content}
            </Typography>
          )}
          {item.type === "image" && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img src={item.content} alt={item.source.title || prettyUrl(item.source.url)} style={{ maxWidth: "100%", borderRadius: 8 }} />
            </Box>
          )}
          {item.type === "link" && (
            <Typography variant="body1">
              <Link href={item.content} target="_blank" rel="noreferrer" underline="hover">
                {prettyUrl(item.content)}
              </Link>
            </Typography>
          )}
          {item.type === "snapshot" && (
            typeof item.content === "string" && item.content.startsWith("data:image") ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <img src={item.content} alt={item.source.title || prettyUrl(item.source.url)} style={{ maxWidth: "100%", borderRadius: 8 }} />
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                长截图（合成）已保存
              </Typography>
            )
          )}
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            来源：
            <Link href={item.source.url} target="_blank" rel="noreferrer" underline="hover">
              {item.source.title || prettyUrl(item.source.url)}
            </Link>
          </Typography>
          {item.context?.paragraph && (
            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>所在段落</Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{item.context.paragraph}</Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 1.5 }}>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>

      {/* 隐藏的分享卡片，用于导出 */}
      <Box
        sx={{
          position: "fixed",
          top: -10000,
          left: -10000,
          zIndex: -1
        }}
      >
        <ShareCard ref={shareCardRef} item={item} theme={selectedTheme} />
      </Box>
    </Dialog>
  )
}
