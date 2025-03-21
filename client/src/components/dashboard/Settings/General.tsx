import {
  Avatar,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function General({ userData }: { userData: any }) {
  return (
    <Box sx={{ maxWidth: 800 }}>
      <Divider />
      <Box
        sx={{
          my: 2,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography width={150} fontWeight={"600"}>
          Profile Picture
        </Typography>
        <Stack
          justifyContent={"space-between"}
          sx={{
            flexGrow: 1,
            maxWidth: 500,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ height: 128, width: 128 }} />
          <Stack direction={"row"} spacing={2}>
            <Button sx={{ ml: 2 }}>Edit Picture</Button>
            <Button variant="contained" sx={{ ml: 2 }}>
              Change Picture
            </Button>
          </Stack>
        </Stack>
      </Box>
      <Divider />
      <div>
        <Box
          sx={{
            my: 3,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography width={150}>Full Name</Typography>
          <TextField
            sx={{ flexGrow: 1, maxWidth: 500 }}
            value={userData.name}
          />
        </Box>
        <Box
          sx={{
            my: 3,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography width={150}>Email</Typography>
          <TextField
            sx={{ flexGrow: 1, maxWidth: 500 }}
            value={userData.email}
          />
        </Box>
      </div>
      <Divider />
    </Box>
  );
}

export default General;
