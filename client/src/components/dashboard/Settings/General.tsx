import { Box, Button, Divider, TextField, Typography } from "@mui/material";

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
        <Box
          sx={{
            flexGrow: 1,
            maxWidth: 500,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <img
            src="https://placehold.co/600x400"
            alt="profile"
            style={{ borderRadius: "50%", width: 150, height: 150 }}
          />
          <Button variant="contained" sx={{ ml: 2 }}>
            Change Picture
          </Button>
        </Box>
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
