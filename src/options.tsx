import GitHubIcon from "@mui/icons-material/GitHub"
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import { ThemeProvider } from "@mui/material/styles"
import Tooltip from "@mui/material/Tooltip"
import { useEffect, useState } from "react"

import iconPng from "./assets/icon.png"
import ItemCard from "./components/ItemCard"
import ItemDialog from "./components/ItemDialog"
import { deleteItem, exportItems, searchItems } from "./lib/db"
import { toZip } from "./lib/export"
import { theme } from "./lib/theme"
import type { Item, SearchQuery } from "./lib/types"

export default function OptionsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [keyword, setKeyword] = useState("")
  const [type, setType] = useState<string>("")
  const [dialogItem, setDialogItem] = useState<Item | null>(null)
  const [compactHeader, setCompactHeader] = useState(false)

  useEffect(() => {
    onSearch()
  }, [])
  useEffect(() => {
    const t = setTimeout(() => {
      onSearch()
    }, 300)
    return () => clearTimeout(t)
  }, [keyword, type])

  const onSearch = async () => {
    const q: SearchQuery = { keyword, type: (type || undefined) as any }
    const list = await searchItems(q)
    setItems(list)
  }

  const onDelete = async (id: string) => {
    await deleteItem(id)
    onSearch()
  }

  // removed markdown/csv export logic; simplified to direct ZIP export

  function download(filename: string, content: string) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    const COMPACT_THRESHOLD = 120
    const EXPAND_THRESHOLD = 60
    const onScroll = () => {
      const y = window.scrollY
      setCompactHeader((prev) => {
        if (!prev && y >= COMPACT_THRESHOLD) return true
        if (prev && y <= EXPAND_THRESHOLD) return false
        return prev
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ py: 2 }} maxWidth="md">
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1100,
            bgcolor: "background.default",
            transition: "transform 300ms ease, opacity 300ms ease",
            minHeight: 64,
            display: "flex",
            alignItems: "center"
          }}>
          <Stack
            direction={compactHeader ? "row" : "column"}
            spacing={compactHeader ? 1 : 0}
            alignItems={compactHeader ? "center" : "flex-start"}>
            <Typography
              variant="h5"
              sx={{ transition: "transform 300ms ease, opacity 300ms ease" }}>
              拾句 · 管理页
            </Typography>
            <Typography
              variant={compactHeader ? "caption" : "body2"}
              sx={{
                color: "text.secondary",
                transition: "transform 300ms ease, opacity 300ms ease",
                whiteSpace: compactHeader ? "nowrap" : "normal",
                textOverflow: compactHeader ? "ellipsis" : "unset",
                overflow: compactHeader ? "hidden" : "visible"
              }}>
              灵感一闪，即可拾取，汇聚成属于你的知识与灵感片段集。
            </Typography>
          </Stack>
        </Box>
        <Box
          sx={{
            position: "sticky",
            top: 64,
            zIndex: 1050,
            py: 1,
            bgcolor: "background.default"
          }}>
          <Stack direction="row" spacing={1}>
            <TextField
              placeholder="搜索关键词"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              size="small"
              fullWidth
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="type-label">类型</InputLabel>
              <Select
                labelId="type-label"
                value={type}
                label="类型"
                onChange={(e) => setType(e.target.value)}>
                <MenuItem value="">全部</MenuItem>
                <MenuItem value="text">文本</MenuItem>
                <MenuItem value="image">图片</MenuItem>
                <MenuItem value="link">链接</MenuItem>
                <MenuItem value="snapshot">快照</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={async () => {
                const all = await exportItems()
                const blob = await toZip(all)
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = "pickquote-export.zip"
                a.click()
                URL.revokeObjectURL(url)
              }}>
              导出
            </Button>
          </Stack>
        </Box>
        <Box sx={{ columnCount: { xs: 1, sm: 2, md: 3 }, columnGap: 2 }}>
          {items.map((it) => (
            <Box key={it.id} sx={{ breakInside: "avoid", mb: 2 }}>
              <ItemCard
                item={it}
                onDelete={onDelete}
                onClick={() => setDialogItem(it)}
              />
            </Box>
          ))}
        </Box>
        <ItemDialog
          item={dialogItem}
          open={Boolean(dialogItem)}
          onClose={() => setDialogItem(null)}
        />
        <Box
          component="footer"
          sx={{
            mt: 4,
            py: 2,
            color: "text.secondary",
            borderTop: "1px solid #eee"
          }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 0.5 }}>
            <Avatar
              src={iconPng}
              alt="拾句"
              sx={{ width: 24, height: 24, boxShadow: 1, opacity: 0.95 }}
            />
            <Typography variant="caption" sx={{ fontStyle: "italic" }}>
              拾句 · 灵感库 — 数据仅存本地 IndexedDB · v0.1
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="caption">开源地址：</Typography>
            <Tooltip title="GitHub: minorcell/pick-quote">
              <IconButton
                size="small"
                component="a"
                href="https://github.com/minorcell/pick-quote"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub repository">
                <GitHubIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
