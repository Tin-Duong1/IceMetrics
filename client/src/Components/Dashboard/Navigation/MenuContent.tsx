import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import React from "react";
import {
  AnalyticsRounded,
  FeedRounded,
  HomeRounded,
  InfoRounded,
  SettingsRounded,
  UploadRounded,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
const mainItems = [
  { name: "Home", icon: <HomeRounded /> },
  { name: "Analytics", icon: <AnalyticsRounded /> },
  { name: "Uploads", icon: <UploadRounded /> },
];

const secondaryItems = [{ name: "Settings", icon: <SettingsRounded /> }];

function MenuContent({
  setActivePage,
  activePage,
  closeDrawer, // Optional prop to close the drawer
}: {
  setActivePage: (page: string) => void;
  activePage: string;
  closeDrawer?: () => void;
}) {
  return (
    <Stack
      sx={{
        flexGrow: 1,
        justifyContent: "space-between",
      }}
    >
      <List dense>
        {mainItems.map((item, index) => (
          <ListItem
            key={index}
            sx={{
              display: "block",
              width: "100%",
              padding: 0,
            }}
          >
            <ListItemButton
              onClick={() => {
                setActivePage(item.name);
                closeDrawer?.();
              }}
              sx={{
                color: activePage === item.name ? "black" : "grey",
                backgroundColor:
                  activePage === item.name ? grey[200] : "inherit",
                width: "fill-content",
                display: "flex",
                justifyContent: "flex-start",
                gap: 1,
              }}
            >
              {item.icon}
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryItems.map((item, index) => (
          <ListItem
            key={index}
            sx={{
              display: "block",
              width: "100%",
              padding: 0,
            }}
          >
            <ListItemButton
              onClick={() => {
                setActivePage(item.name);
                closeDrawer?.();
              }}
              sx={{
                color: activePage === item.name ? "black" : "grey",
                backgroundColor:
                  activePage === item.name ? grey[200] : "inherit",
                width: "fill-content",
                display: "flex",
                justifyContent: "flex-start",
                gap: 1,
              }}
            >
              {item.icon}
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

export default MenuContent;
