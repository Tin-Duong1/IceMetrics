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
  PeopleOutlineRounded,
  SettingsRounded,
} from "@mui/icons-material";
const mainItems = [
  { name: "Home", icon: <HomeRounded /> },
  { name: "Analytics", icon: <AnalyticsRounded /> },
  { name: "Data", icon: <PeopleOutlineRounded /> },
];

const secondaryItems = [
  { name: "Settings", icon: <SettingsRounded /> },
  { name: "About", icon: <InfoRounded /> },
  { name: "Feedback", icon: <FeedRounded /> },
];

function MenuContent({
  setActivePage,
}: {
  setActivePage: (page: string) => void;
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
          <ListItem key={index} sx={{ display: "block" }}>
            <ListItemButton onClick={() => setActivePage(item.name)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryItems.map((item, index) => (
          <ListItem key={index} sx={{ display: "block" }}>
            <ListItemButton onClick={() => setActivePage(item.name)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

export default MenuContent;
