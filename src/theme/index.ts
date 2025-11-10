import { createTheme, type PaletteMode } from "@mui/material/styles"

export type ThemeMode = "light" | "dark" | "system" | "custom"
export type ColorScheme =
  | "default"
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "pink"
  | "teal"
  | "indigo"

export interface ThemeConfig {
  mode: ThemeMode
  customColor?: {
    primary: string
    secondary: string
  }
  colorScheme?: ColorScheme
}

const colorSchemes: Record<ColorScheme, { primary: string; secondary: string }> = {
  default: { primary: "#6b7785", secondary: "#9c8b7a" },
  blue: { primary: "#5e81ac", secondary: "#81a1c1" },
  green: { primary: "#88c0d0", secondary: "#8fbcbb" },
  purple: { primary: "#b48ead", secondary: "#d08770" },
  orange: { primary: "#d08770", secondary: "#ebcb8b" },
  pink: { primary: "#bf616a", secondary: "#d08770" },
  teal: { primary: "#8fbcbb", secondary: "#88c0d0" },
  indigo: { primary: "#81a1c1", secondary: "#5e81ac" }
}

function adjustColor(color: string, amount: number): string {
  const hex = color.replace("#", "")
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount * 51))
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount * 51))
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount * 51))
  return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g).toString(16).padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`
}

export const createAppTheme = (
  mode: PaletteMode,
  config?: ThemeConfig
) => {
  const customColors = config?.customColor
  const colors = customColors
    ? customColors
    : config?.colorScheme
      ? colorSchemes[config.colorScheme]
      : colorSchemes.default

  return createTheme({
    palette: {
      mode,
      background: mode === "light"
        ? {
          default: "#faf9f7", // 温暖的米白色背景
          paper: "#ffffff"
        }
        : {
          default: "#1a1a1a", // 深色背景
          paper: "#252525"
        },
      primary: {
        main: colors.primary,
        light: adjustColor(colors.primary, 0.2),
        dark: adjustColor(colors.primary, -0.2)
      },
      secondary: {
        main: colors.secondary,
        light: adjustColor(colors.secondary, 0.2),
        dark: adjustColor(colors.secondary, -0.2)
      },
    text: mode === "light"
      ? {
        primary: "#2d3436", // 深灰色主文本
        secondary: "rgba(45, 52, 54, 0.65)", // 次要文本
        disabled: "rgba(45, 52, 54, 0.38)"
      }
      : {
        primary: "#e8e6e3", // 浅色主文本
        secondary: "rgba(232, 230, 227, 0.65)", // 次要文本
        disabled: "rgba(232, 230, 227, 0.38)"
      },
    divider: mode === "light"
      ? "rgba(45, 52, 54, 0.08)"
      : "rgba(232, 230, 227, 0.12)", // 分割线
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
  shadows: mode === "light"
    ? [
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
    ]
    : [
      "none",
      "0 1px 3px rgba(0, 0, 0, 0.3)",
      "0 2px 6px rgba(0, 0, 0, 0.35)",
      "0 3px 12px rgba(0, 0, 0, 0.4)",
      "0 4px 16px rgba(0, 0, 0, 0.45)",
      "0 6px 20px rgba(0, 0, 0, 0.5)",
      "0 8px 24px rgba(0, 0, 0, 0.55)",
      "0 12px 28px rgba(0, 0, 0, 0.6)",
      "0 16px 32px rgba(0, 0, 0, 0.65)",
      "0 20px 36px rgba(0, 0, 0, 0.7)",
      "0 24px 40px rgba(0, 0, 0, 0.75)",
      "0 28px 44px rgba(0, 0, 0, 0.8)",
      "0 32px 48px rgba(0, 0, 0, 0.85)",
      "0 36px 52px rgba(0, 0, 0, 0.9)",
      "0 40px 56px rgba(0, 0, 0, 0.95)",
      "0 44px 60px rgba(0, 0, 0, 1)",
      "0 48px 64px rgba(0, 0, 0, 1)",
      "0 52px 68px rgba(0, 0, 0, 1)",
      "0 56px 72px rgba(0, 0, 0, 1)",
      "0 60px 76px rgba(0, 0, 0, 1)",
      "0 64px 80px rgba(0, 0, 0, 1)",
      "0 68px 84px rgba(0, 0, 0, 1)",
      "0 72px 88px rgba(0, 0, 0, 1)",
      "0 76px 92px rgba(0, 0, 0, 1)",
      "0 80px 96px rgba(0, 0, 0, 1)"
    ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 400,
          letterSpacing: "0.03em"
        },
        outlined: mode === "light"
          ? {
            borderColor: "rgba(45, 52, 54, 0.15)",
            "&:hover": {
              borderColor: "rgba(45, 52, 54, 0.3)",
              backgroundColor: "rgba(45, 52, 54, 0.02)"
            }
          }
          : {
            borderColor: "rgba(232, 230, 227, 0.2)",
            "&:hover": {
              borderColor: "rgba(232, 230, 227, 0.4)",
              backgroundColor: "rgba(232, 230, 227, 0.08)"
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
          borderColor: mode === "light"
            ? "rgba(45, 52, 54, 0.08)"
            : "rgba(232, 230, 227, 0.12)"
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: mode === "light"
              ? "rgba(45, 52, 54, 0.04)"
              : "rgba(232, 230, 227, 0.08)"
          }
        }
      }
    }
  }
})
