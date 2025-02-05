import { Box } from "@mui/material";
import SideBar from "./components/dashboard/SideBar";

function Dashboard() {
  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
    </Box>
  );
}

export default Dashboard;
