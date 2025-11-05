import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded"
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded"
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded"
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined"
import ImageRoundedIcon from "@mui/icons-material/ImageRounded"
import LinkRoundedIcon from "@mui/icons-material/LinkRounded"
import {
  Box,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  Typography
} from "@mui/material"
import { useRef, useState } from "react"

import { exportToImage } from "../lib/imageExport"
import type { Item } from "../lib/types"
import { prettyUrl } from "../lib/utils"
import ShareCard from "./ShareCard"

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
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2.5,
        p: 2.5,
        mb: 2,
        cursor: "pointer",
        bgcolor: "background.paper",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "1px solid",
        borderColor: "divider",
        "&:hover": {
          boxShadow: 2,
          transform: "translateY(-2px)",
          borderColor: "primary.light"
        }
      }}
      onClick={onClick}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ color: "text.secondary", opacity: 0.7 }}>{icon}</Box>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontSize: "0.7rem",
              letterSpacing: "0.05em"
            }}>
            {item.type.toUpperCase()} ·{" "}
            {new Date(item.createdAt).toLocaleDateString("zh-CN", {
              month: "long",
              day: "numeric"
            })}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{
            opacity: 0.6,
            transition: "opacity 0.2s",
            "&:hover": { opacity: 1 }
          }}>
          <Tooltip title="导出为图片">
            <IconButton
              size="small"
              onClick={handleExportClick}
              disabled={isExporting}
              sx={{ p: 0.75 }}>
              <ImageOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="打开来源">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                window.open(item.source.url, "_blank")
              }}
              sx={{ p: 0.75 }}>
              <LinkRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="删除">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(item.id)
              }}
              sx={{ p: 0.75 }}>
              <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Stack>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          onClick={(e) => e.stopPropagation()}>
          <MenuItem onClick={() => handleExportImage("dark")}>
            深色主题
          </MenuItem>
          <MenuItem onClick={() => handleExportImage("light")}>
            浅色主题
          </MenuItem>
        </Menu>
      </Stack>

      <Box sx={{ mb: 2 }}>
        {item.type === "text" && (
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                top: -6,
                left: -6,
                fontSize: "2rem",
                color: "text.disabled",
                opacity: 0.3,
                fontFamily: "Georgia, serif"
              }}>
              "
            </Box>
            <Typography
              variant="body2"
              sx={{
                lineHeight: 1.9,
                color: "text.primary",
                pl: 2,
                pr: 1,
                fontSize: "0.95rem"
              }}>
              {item.content.length > 160
                ? item.content.slice(0, 160) + "…"
                : item.content}
            </Typography>
          </Box>
        )}
        {item.type === "image" && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
            <img
              src={item.content}
              alt={item.source.title || prettyUrl(item.source.url)}
              style={{
                maxWidth: "100%",
                maxHeight: 200,
                borderRadius: 10
              }}
            />
          </Box>
        )}
        {item.type === "link" && (
          <Stack spacing={0.5}>
            <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
              <Link
                href={item.content}
                target="_blank"
                rel="noreferrer"
                underline="hover"
                sx={{ color: "primary.main" }}>
                {prettyUrl(item.content)}
              </Link>
            </Typography>
          </Stack>
        )}
        {item.type === "snapshot" &&
          (typeof item.content === "string" &&
          item.content.startsWith("data:image") ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
              <img
                src={item.content}
                alt={item.source.title || prettyUrl(item.source.url)}
                style={{
                  maxWidth: "100%",
                  maxHeight: 240,
                  borderRadius: 10
                }}
              />
            </Box>
          ) : (
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
              已保存长截图（合成）
            </Typography>
          ))}
      </Box>

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
    </Paper>
  )
}
