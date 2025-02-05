import { Box } from "@mui/material";
import Logo from "/LogoBlack.svg";
import { grey } from "@mui/material/colors";

function SideBarLogo() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        height: 100,
        paddingLeft: 4,
        borderBottom: "1px solid",
        borderColor: grey[300],
      }}
    >
      <img src={Logo} height={36} alt="logo" />
    </Box>
  );
}

export default SideBarLogo;
