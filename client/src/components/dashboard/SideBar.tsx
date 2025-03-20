import { Box } from "@mui/material";
import MenuContent from "./MenuContent";
import SideBarLogo from "./SideBarLogo";
import { grey } from "@mui/material/colors";
import SideBarAccount from "./SideBarAccount";

function SideBar({
  setActivePage,
  activePage,
}: {
  setActivePage: (page: string) => void;
  activePage: string;
}) {
  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: grey[100],
        display: "flex",
        flexDirection: "column",
        borderInlineEnd: "1px solid",
        borderColor: grey[200],
      }}
    >
      <SideBarLogo />
      <MenuContent setActivePage={setActivePage} activePage={activePage} />
      <SideBarAccount />
    </Box>
  );
}

export default SideBar;
