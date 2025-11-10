import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  Paper
} from "@mui/material"
import { ThemeConfig, type ThemeMode, type ColorScheme } from "../theme"
import { useEffect, useState } from "react"

interface SettingsPageProps {
  themeConfig: ThemeConfig
  onThemeChange: (config: ThemeConfig) => void
}

const colorSchemes: Array<{
  value: ColorScheme
  label: string
  color: string
  secondaryColor: string
}> = [
  { value: "default", label: "默认灰蓝", color: "#6b7785", secondaryColor: "#9c8b7a" },
  { value: "blue", label: "海洋蓝", color: "#5e81ac", secondaryColor: "#81a1c1" },
  { value: "green", label: "薄荷绿", color: "#88c0d0", secondaryColor: "#8fbcbb" },
  { value: "purple", label: "优雅紫", color: "#b48ead", secondaryColor: "#d08770" },
  { value: "orange", label: "温暖橙", color: "#d08770", secondaryColor: "#ebcb8b" },
  { value: "pink", label: "樱花粉", color: "#bf616a", secondaryColor: "#d08770" },
  { value: "teal", label: "青绿色", color: "#8fbcbb", secondaryColor: "#88c0d0" },
  { value: "indigo", label: "靛蓝色", color: "#81a1c1", secondaryColor: "#5e81ac" }
]

export default function SettingsPage({ themeConfig, onThemeChange }: SettingsPageProps) {
  const [localConfig, setLocalConfig] = useState<ThemeConfig>(themeConfig)

  const handleModeChange = (mode: ThemeMode) => {
    const newConfig = { ...localConfig, mode }
    setLocalConfig(newConfig)
    onThemeChange(newConfig)
  }

  const handleColorSchemeChange = (colorScheme: ColorScheme) => {
    const newConfig = { ...localConfig, colorScheme, customColor: undefined }
    setLocalConfig(newConfig)
    onThemeChange(newConfig)
  }

  const handleCustomColorChange = (primary: string, secondary: string) => {
    const newConfig = { ...localConfig, customColor: { primary, secondary }, colorScheme: undefined }
    setLocalConfig(newConfig)
    onThemeChange(newConfig)
  }

  return (
    <Stack spacing={3}>
      <Card elevation={0}>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontSize: "1.1rem",
              fontWeight: 500,
              letterSpacing: "0.02em"
            }}>
            主题设置
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mb: 3,
              lineHeight: 1.6
            }}>
            自定义应用外观，选择您喜欢的主题模式和颜色风格
          </Typography>

          <Stack spacing={3}>
            {/* 主题模式选择 */}
            <Box>
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  sx={{
                    mb: 2,
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "text.primary"
                  }}>
                  主题模式
                </FormLabel>
                <RadioGroup
                  value={localConfig.mode}
                  onChange={(e) => handleModeChange(e.target.value as ThemeMode)}>
                  <FormControlLabel
                    value="light"
                    control={<Radio />}
                    label={
                      <Stack spacing={0.5}>
                        <Typography variant="body2" fontWeight={500}>
                          浅色模式
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          适合白天使用，背景明亮
                        </Typography>
                      </Stack>
                    }
                    sx={{ alignItems: "flex-start", ml: 0 }}
                  />
                  <FormControlLabel
                    value="dark"
                    control={<Radio />}
                    label={
                      <Stack spacing={0.5}>
                        <Typography variant="body2" fontWeight={500}>
                          深色模式
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          适合夜晚使用，护眼舒适
                        </Typography>
                      </Stack>
                    }
                    sx={{ alignItems: "flex-start", ml: 0 }}
                  />
                  <FormControlLabel
                    value="system"
                    control={<Radio />}
                    label={
                      <Stack spacing={0.5}>
                        <Typography variant="body2" fontWeight={500}>
                          跟随系统
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          自动匹配操作系统设置
                        </Typography>
                      </Stack>
                    }
                    sx={{ alignItems: "flex-start", ml: 0 }}
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            {/* 预设颜色方案 */}
            {localConfig.mode !== "system" && (
              <Box>
                <FormLabel
                  sx={{
                    mb: 2,
                    display: "block",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "text.primary"
                  }}>
                  主题色彩
                </FormLabel>
                <Grid container spacing={2}>
                  {colorSchemes.map((scheme) => (
                    <Grid item xs={6} sm={4} key={scheme.value}>
                      <Paper
                        elevation={localConfig.colorScheme === scheme.value ? 3 : 1}
                        sx={{
                          p: 2,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          border: localConfig.colorScheme === scheme.value
                            ? 2
                            : 1,
                          borderColor: localConfig.colorScheme === scheme.value
                            ? "primary.main"
                            : "divider",
                          bgcolor: "background.paper",
                          "&:hover": {
                            elevation: 3,
                            transform: "translateY(-2px)"
                          }
                        }}
                        onClick={() => handleColorSchemeChange(scheme.value)}>
                        <Stack spacing={1.5}>
                          <Stack direction="row" spacing={1}>
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: 1,
                                bgcolor: scheme.color
                              }}
                            />
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: 1,
                                bgcolor: scheme.secondaryColor
                              }}
                            />
                          </Stack>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "0.85rem",
                              fontWeight: localConfig.colorScheme === scheme.value ? 500 : 400,
                              color: localConfig.colorScheme === scheme.value
                                ? "primary.main"
                                : "text.primary"
                            }}>
                            {scheme.label}
                          </Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* 自定义颜色 */}
            {localConfig.mode !== "system" && (
              <Box>
                <FormLabel
                  sx={{
                    mb: 2,
                    display: "block",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "text.primary"
                  }}>
                  自定义颜色
                </FormLabel>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "background.paper" }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <FormControl sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                        主色调
                      </Typography>
                      <input
                        type="color"
                        value={localConfig.customColor?.primary || colorSchemes.find(s => s.value === (localConfig.colorScheme || "default"))?.color || "#6b7785"}
                        onChange={(e) => handleCustomColorChange(
                          e.target.value,
                          localConfig.customColor?.secondary || colorSchemes.find(s => s.value === (localConfig.colorScheme || "default"))?.secondaryColor || "#9c8b7a"
                        )}
                        style={{
                          width: "100%",
                          height: 40,
                          border: "1px solid #ccc",
                          borderRadius: 8,
                          cursor: "pointer"
                        }}
                      />
                    </FormControl>
                    <FormControl sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                        辅助色
                      </Typography>
                      <input
                        type="color"
                        value={localConfig.customColor?.secondary || colorSchemes.find(s => s.value === (localConfig.colorScheme || "default"))?.secondaryColor || "#9c8b7a"}
                        onChange={(e) => handleCustomColorChange(
                          localConfig.customColor?.primary || colorSchemes.find(s => s.value === (localConfig.colorScheme || "default"))?.color || "#6b7785",
                          e.target.value
                        )}
                        style={{
                          width: "100%",
                          height: 40,
                          border: "1px solid #ccc",
                          borderRadius: 8,
                          cursor: "pointer"
                        }}
                      />
                    </FormControl>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                    选择了自定义颜色后，预设颜色方案将失效
                  </Typography>
                </Paper>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}