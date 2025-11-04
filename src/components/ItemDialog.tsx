import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, Link, Box, IconButton, Tooltip } from "@mui/material"
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded"
import ImageRoundedIcon from "@mui/icons-material/ImageRounded"
import LinkRoundedIcon from "@mui/icons-material/LinkRounded"
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded"
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded"
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded"
import type { Item } from "../lib/types"
import { prettyUrl } from "../lib/utils"

export default function ItemDialog({ item, open, onClose }: { item: Item | null; open: boolean; onClose: () => void }) {
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
    </Dialog>
  )
}
