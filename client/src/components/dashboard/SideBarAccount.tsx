import {
  AccountCircleOutlined,
  AccountCircleRounded,
  Circle,
  MoreVertRounded,
} from "@mui/icons-material";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

function SideBarAccount() {
  return (
    <Stack
      direction={"row"}
      gap={1}
      sx={{
        display: "flex",
        alignItems: "center",
        height: 100,
        padding: 2,
        borderTop: "1px solid",
        borderColor: grey[300],
      }}
    >
      <AccountCircleRounded sx={{ fontSize: 42 }} />
      <Stack>
        <Typography>Jake Morgan</Typography>
        <Typography variant="caption" fontSize={10}>
          jake81morgan@gmail.com
        </Typography>
      </Stack>
      <IconButton
        size="small"
        aria-label="settings"
        sx={{
          ":hover": {
            border: "1px solid",
            backgroundColor: grey[400],
          },
          borderRadius: 2,
          width: 42,
          height: 42,
        }}
      >
        <MoreVertRounded />
      </IconButton>
    </Stack>
  );
}

export default SideBarAccount;
