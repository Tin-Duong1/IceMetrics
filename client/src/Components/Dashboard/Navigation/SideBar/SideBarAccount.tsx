import {
  AccountCircleOutlined,
  AccountCircleRounded,
  Circle,
  MoreVertRounded,
} from "@mui/icons-material";
import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import OptionsMenu from "./OptionsMenu";

function SideBarAccount({
  userData,
  setActivePage,
}: {
  userData: { name: string; email: string; phoneNumber: string };
  setActivePage: (page: string) => void;
}) {
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
      <Avatar
        sizes="small"
        alt={userData.name}
        sx={{ width: 36, height: 36 }}
      />
      <Stack>
        <Typography>{userData.name}</Typography>
        <Typography variant="caption" fontSize={10}>
          {userData.email}
        </Typography>
      </Stack>
      <OptionsMenu setActivePage={setActivePage} />
    </Stack>
  );
}

export default SideBarAccount;
