import { Box, List, ListItemButton, ListItemIcon, ListItemText, Paper, Stack } from "@mui/material"
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark"
import SettingsIcon from "@mui/icons-material/Settings"

export type TabValue = "quotes" | "settings"

interface TabNavigationProps {
  value: TabValue
  onChange: (value: TabValue) => void
}

export default function TabNavigation({ value, onChange }: TabNavigationProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: 240,
        height: "fit-content",
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        position: "sticky",
        top: 20,
        overflow: "hidden"
      }}>
      <List sx={{ p: 1 }}>
        <ListItemButton
          selected={value === "quotes"}
          onClick={() => onChange("quotes")}
          sx={{
            borderRadius: 2,
            mb: 0.5,
            "&.Mui-selected": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": {
                bgcolor: "primary.dark"
              },
              "& .MuiListItemIcon-root": {
                color: "primary.contrastText"
              }
            }
          }}>
          <ListItemIcon>
            <CollectionsBookmarkIcon />
          </ListItemIcon>
          <ListItemText
            primary="摘抄"
            primaryTypographyProps={{
              fontSize: "0.95rem",
              fontWeight: 400,
              letterSpacing: "0.02em"
            }}
          />
        </ListItemButton>
        <ListItemButton
          selected={value === "settings"}
          onClick={() => onChange("settings")}
          sx={{
            borderRadius: 2,
            "&.Mui-selected": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": {
                bgcolor: "primary.dark"
              },
              "& .MuiListItemIcon-root": {
                color: "primary.contrastText"
              }
            }
          }}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText
            primary="设置"
            primaryTypographyProps={{
              fontSize: "0.95rem",
              fontWeight: 400,
              letterSpacing: "0.02em"
            }}
          />
        </ListItemButton>
      </List>
    </Paper>
  )
}