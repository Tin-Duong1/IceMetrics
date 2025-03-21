import React from "react";
import Button from "@mui/material/Button";
import axios from "axios";

function Data() {
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("jwt_token"); // Retrieve token from localStorage
      const response = await axios.delete("api/me/delete_account", {
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to headers
        },
      });
      alert(response.data.detail);
      localStorage.removeItem("jwt_token"); // Remove token from localStorage
      window.location.href = "/";
    } catch (error) {
      alert("An error occurred");
    }
  };

  return (
    <Button
      fullWidth
      variant="contained"
      color="error"
      onClick={handleDeleteAccount}
    >
      Delete Account
    </Button>
  );
}

export default Data;
