import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import React from "react";
import { HomeRounded, PeopleOutlineRounded } from "@mui/icons-material";

const mainItems = [
  { name: "Home", icon: <PeopleOutlineRounded /> },
  { name: "Analytics", icon: <PeopleOutlineRounded /> },
  { name: "Data", icon: <PeopleOutlineRounded /> },
];

const secondaryItems = [
  { name: "Settings", icon: <PeopleOutlineRounded /> },
  { name: "About", icon: <PeopleOutlineRounded /> },
  { name: "feedback", icon: <PeopleOutlineRounded /> },
];

function MenuContent() {
  return (
    <Stack>
      <List dense>
        {mainItems.map((item, index) => (
          <ListItem key={index} sx={{ display: "block" }}>
            <ListItemButton selected={index === 0}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
        ;
      </List>
    </Stack>
  );
}

export default MenuContent;
