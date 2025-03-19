import { Box } from "@mui/material";
import MenuContent from "./MenuContent";
import SideBarLogo from "./SideBarLogo";
import { grey } from "@mui/material/colors";

function SideBar({ setActivePage }: { setActivePage: (page: string) => void }) {
  return (
    <Box
      sx={{
        width: "240px", // Ensure static width
        height: "100vh",
        backgroundColor: grey[100],
        display: "flex",
        flexDirection: "column",
        borderInlineEnd: "1px solid",
        borderColor: grey[200],
      }}
    >
      <SideBarLogo />
      <MenuContent setActivePage={setActivePage} />
    </Box>
  );
}

export default SideBar;
