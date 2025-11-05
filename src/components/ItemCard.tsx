import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded"
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded"
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded"
import ImageRoundedIcon from "@mui/icons-material/ImageRounded"
import LinkRoundedIcon from "@mui/icons-material/LinkRounded"
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined"
import {
  Box,
  IconButton,
  Link,
  Paper,
  Stack,
  Tooltip,
  Typography,
  Menu,
  MenuItem
} from "@mui/material"
import { useRef, useState } from "react"

import type { Item } from "../lib/types"
import { prettyUrl } from "../lib/utils"
import ShareCard from "./ShareCard"
import { exportToImage } from "../lib/imageExport"

export default function ItemCard({
  item,
  onDelete,
  onClick
}: {
  item: Item
  onDelete: (id: string) => void
  onClick?: () => void
}) {
  const shareCardRef = useRef<HTMLDivElement>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedTheme, setSelectedTheme] = useState<"dark" | "light">("dark")
  const [isExporting, setIsExporting] = useState(false)

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
    event.stopPropagation()
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
    <Paper
      variant="outlined"
      sx={{ borderRadius: 2, p: 2, mb: 2, cursor: "pointer" }}
      onClick={onClick}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          {icon}
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {item.type.toUpperCase()} ·{" "}
            {new Date(item.createdAt).toLocaleString()}
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
              onClick={(e) => {
                e.stopPropagation()
                window.open(item.source.url, "_blank")
              }}>
              <LinkRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="删除">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(item.id)
              }}>
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={() => handleExportImage("dark")}>深色主题</MenuItem>
          <MenuItem onClick={() => handleExportImage("light")}>浅色主题</MenuItem>
        </Menu>
      </Stack>

      <Box sx={{ mb: 1 }}>
        {item.type === "text" && (
          <Typography
            variant="body1"
            sx={{ fontStyle: "italic", lineHeight: 1.7 }}>
            “
            {item.content.length > 160
              ? item.content.slice(0, 160) + "…"
              : item.content}
            ”
          </Typography>
        )}
        {item.type === "image" && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img
              src={item.content}
              alt={item.source.title || prettyUrl(item.source.url)}
              style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8 }}
            />
          </Box>
        )}
        {item.type === "link" && (
          <Stack spacing={0.5}>
            <Typography variant="body1">
              <Link
                href={item.content}
                target="_blank"
                rel="noreferrer"
                underline="hover">
                {prettyUrl(item.content)}
              </Link>
            </Typography>
          </Stack>
        )}
        {item.type === "snapshot" && (
          typeof item.content === "string" && item.content.startsWith("data:image") ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img src={item.content} alt={item.source.title || prettyUrl(item.source.url)} style={{ maxWidth: "100%", maxHeight: 240, borderRadius: 8 }} />
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              已保存长截图（合成）
            </Typography>
          )
        )}
      </Box>

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
    </Paper>
  )
}
