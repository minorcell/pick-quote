import { createTheme } from "@mui/material/styles"

export const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#faf9f7", // 温暖的米白色背景
      paper: "#ffffff"
    },
    primary: {
      main: "#6b7785", // 柔和的蓝灰色
      light: "#8a96a3",
      dark: "#4a5563"
    },
    secondary: {
      main: "#9c8b7a", // 雅致的棕灰色
      light: "#b5a598",
      dark: "#7d6f61"
    },
    text: {
      primary: "#2d3436", // 深灰色主文本
      secondary: "rgba(45, 52, 54, 0.65)", // 次要文本
      disabled: "rgba(45, 52, 54, 0.38)"
    },
    divider: "rgba(45, 52, 54, 0.08)", // 极淡的分割线
    error: {
      main: "#c9786e", // 柔和的错误色
      light: "#d89a91"
    }
  },
  shape: {
    borderRadius: 12 // 更圆润的边角
  },
  typography: {
    fontFamily: [
      "'Noto Serif SC'",
      "'Songti SC'",
      "'STSong'",
      "Georgia",
      "serif",
      "-apple-system",
      "BlinkMacSystemFont"
    ].join(","),
    h5: {
      fontWeight: 400,
      letterSpacing: "0.02em"
    },
    h6: {
      fontWeight: 400,
      letterSpacing: "0.02em"
    },
    body1: {
      lineHeight: 1.8,
      letterSpacing: "0.02em"
    },
    body2: {
      lineHeight: 1.7,
      letterSpacing: "0.02em"
    },
    caption: {
      letterSpacing: "0.03em"
    }
  },
  shadows: [
    "none",
    "0 1px 3px rgba(45, 52, 54, 0.04)",
    "0 2px 6px rgba(45, 52, 54, 0.06)",
    "0 3px 12px rgba(45, 52, 54, 0.08)",
    "0 4px 16px rgba(45, 52, 54, 0.1)",
    "0 6px 20px rgba(45, 52, 54, 0.12)",
    "0 8px 24px rgba(45, 52, 54, 0.14)",
    "0 12px 28px rgba(45, 52, 54, 0.16)",
    "0 16px 32px rgba(45, 52, 54, 0.18)",
    "0 20px 36px rgba(45, 52, 54, 0.2)",
    "0 24px 40px rgba(45, 52, 54, 0.22)",
    "0 28px 44px rgba(45, 52, 54, 0.24)",
    "0 32px 48px rgba(45, 52, 54, 0.26)",
    "0 36px 52px rgba(45, 52, 54, 0.28)",
    "0 40px 56px rgba(45, 52, 54, 0.3)",
    "0 44px 60px rgba(45, 52, 54, 0.32)",
    "0 48px 64px rgba(45, 52, 54, 0.34)",
    "0 52px 68px rgba(45, 52, 54, 0.36)",
    "0 56px 72px rgba(45, 52, 54, 0.38)",
    "0 60px 76px rgba(45, 52, 54, 0.4)",
    "0 64px 80px rgba(45, 52, 54, 0.42)",
    "0 68px 84px rgba(45, 52, 54, 0.44)",
    "0 72px 88px rgba(45, 52, 54, 0.46)",
    "0 76px 92px rgba(45, 52, 54, 0.48)",
    "0 80px 96px rgba(45, 52, 54, 0.5)"
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 400,
          letterSpacing: "0.03em"
        },
        outlined: {
          borderColor: "rgba(45, 52, 54, 0.15)",
          "&:hover": {
            borderColor: "rgba(45, 52, 54, 0.3)",
            backgroundColor: "rgba(45, 52, 54, 0.02)"
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none"
        },
        outlined: {
          borderColor: "rgba(45, 52, 54, 0.08)"
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(45, 52, 54, 0.04)"
          }
        }
      }
    }
  }
})
