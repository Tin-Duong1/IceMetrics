import { Box } from "@mui/material";
import MenuContent from "./MenuContent";
import SideBarLogo from "./SideBarLogo";
import { grey } from "@mui/material/colors";
import SideBarAccount from "./SideBarAccount";
import { useEffect, useState } from "react";
import axios from "axios";

function SideBar({
  setActivePage,
  activePage,
}: {
  setActivePage: (page: string) => void;
  activePage: string;
}) {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const response = await axios.get("/api/me/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

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
      <SideBarAccount
        name={userData.name}
        email={userData.email}
        phoneNumber={userData.phoneNumber}
      />
    </Box>
  );
}

export default SideBar;
