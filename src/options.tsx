import GitHubIcon from "@mui/icons-material/GitHub"
import {
  Box,
  Button,
  Container,
  CssBaseline,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery
} from "@mui/material"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import { ThemeProvider } from "@mui/material/styles"
import Tooltip from "@mui/material/Tooltip"
import { useEffect, useMemo, useState } from "react"

import iconPng from "./assets/icon.png"
import ItemCard from "./components/ItemCard"
import ItemDialog from "./components/ItemDialog"
import { deleteItem, exportItems, searchItems } from "./lib/db"
import { toZip } from "./lib/export"
import { createAppTheme } from "./lib/theme"
import type { Item, SearchQuery } from "./lib/types"

export default function OptionsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [keyword, setKeyword] = useState("")
  const [type, setType] = useState<string>("")
  const [dialogItem, setDialogItem] = useState<Item | null>(null)
  const [compactHeader, setCompactHeader] = useState(false)

  // 检测浏览器的暗色模式偏好
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")

  // 根据系统偏好创建主题
  const theme = useMemo(
    () => createAppTheme(prefersDarkMode ? "dark" : "light"),
    [prefersDarkMode]
  )

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

  const headerHeight = 52

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default"
        }}>
        <Container sx={{ py: 4 }} maxWidth="md">
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1100,
              bgcolor: "background.default",
              transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
              height: headerHeight,
              display: "flex",
              alignItems: "center"
            }}>
            <Stack
              direction={compactHeader ? "row" : "column"}
              spacing={compactHeader ? 1.5 : 0.5}
              alignItems={compactHeader ? "center" : "flex-start"}
              sx={{ width: "100%" }}>
              <Typography
                variant="h5"
                sx={{
                  transition: "all 300ms ease",
                  fontSize: "1.75rem",
                  fontWeight: 400,
                  letterSpacing: "0.08em"
                }}>
                拾句
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  transition: "all 300ms ease",
                  whiteSpace: compactHeader ? "nowrap" : "normal",
                  textOverflow: compactHeader ? "ellipsis" : "unset",
                  fontSize: "0.75rem",
                  maxWidth: compactHeader ? "none" : "80%"
                }}>
                灵感一闪，即可拾取，汇聚成属于你的知识与灵感片段集
              </Typography>
            </Stack>
          </Box>
          <Box
            sx={{
              position: "sticky",
              top: headerHeight,
              zIndex: 1050,
              py: 2,
              bgcolor: "background.default",
              transition: "top 300ms cubic-bezier(0.4, 0, 0.2, 1)"
            }}>
            <Stack direction="row" spacing={1.5}>
              <TextField
                placeholder="搜索关键词"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                size="small"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "primary.light"
                    }
                  }
                }}
              />
              <FormControl
                size="small"
                sx={{
                  minWidth: 120,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.paper",
                    borderRadius: 2
                  }
                }}>
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
                sx={{
                  borderRadius: 2,
                  px: 2.5,
                  minWidth: 80
                }}
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
          <Box
            sx={{
              columnCount: { xs: 1, sm: 2, md: 3 },
              columnGap: 2.5,
              mt: 2
            }}>
            {items.map((it) => (
              <Box key={it.id} sx={{ breakInside: "avoid" }}>
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
              mt: 6,
              py: 3,
              color: "text.secondary",
              borderTop: "1px solid",
              borderColor: "divider"
            }}>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ mb: 1 }}>
              <Avatar
                src={iconPng}
                alt="拾句"
                sx={{
                  width: 28,
                  height: 28,
                  boxShadow: 1,
                  opacity: 0.9
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontStyle: "italic",
                  fontSize: "0.8rem",
                  letterSpacing: "0.03em"
                }}>
                拾句 · 灵感库 — 数据仅存本地 IndexedDB · v0.1
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                开源地址：
              </Typography>
              <Tooltip title="GitHub: minorcell/pick-quote">
                <IconButton
                  size="small"
                  component="a"
                  href="https://github.com/minorcell/pick-quote"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub repository"
                  sx={{ ml: 0.5 }}>
                  <GitHubIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
