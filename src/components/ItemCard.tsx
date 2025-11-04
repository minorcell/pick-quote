import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded"
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded"
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded"
import ImageRoundedIcon from "@mui/icons-material/ImageRounded"
import LinkRoundedIcon from "@mui/icons-material/LinkRounded"
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded"
import {
  Box,
  IconButton,
  Link,
  Paper,
  Stack,
  Tooltip,
  Typography
} from "@mui/material"

import type { Item } from "../lib/types"
import { prettyUrl } from "../lib/utils"

export default function ItemCard({
  item,
  onDelete,
  onClick
}: {
  item: Item
  onDelete: (id: string) => void
  onClick?: () => void
}) {
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
          <Tooltip title="打开来源">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                window.open(item.source.url, "_blank")
              }}>
              <OpenInNewRoundedIcon fontSize="small" />
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
    </Paper>
  )
}
