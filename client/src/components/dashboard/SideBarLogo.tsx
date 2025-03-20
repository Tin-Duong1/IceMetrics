import { Box, Card } from "@mui/material";
import Logo from "/LogoBlack.svg";
import { grey } from "@mui/material/colors";

function SideBarLogo() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: 100,
        borderBottom: "1px solid",
        borderColor: grey[300],
      }}
    >
      <Card
        sx={{
          height: 64,
          width: 190,
          borderRadius: 2,
          marginInline: "auto",
          display: "flex",
          alignItems: "center",
          padding: 2,
          backgroundColor: "transparent",
        }}
      >
        <img src={Logo} height={36} alt="logo" />
      </Card>
    </Box>
  );
}

export default SideBarLogo;
