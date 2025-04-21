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
