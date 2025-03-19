import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

function Security() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPassword, setShowPassword] = useState<{
    currentPassword: boolean;
    newPassword: boolean;
    confirmNewPassword: boolean;
  }>({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const handleTogglePasswordVisibility = (
    field: "currentPassword" | "newPassword" | "confirmNewPassword"
  ) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt_token");
      await axios.post(
        "/api/me/change_password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmNewPassword: passwordData.confirmNewPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password.");
    }
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setShowPassword({
      currentPassword: false,
      newPassword: false,
      confirmNewPassword: false,
    });
  };

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h5" gutterBottom>
        Security Settings
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            mb: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography width={150}>Current Password</Typography>
          <TextField
            sx={{ flexGrow: 1, maxWidth: 500 }}
            type={showPassword.currentPassword ? "text" : "password"}
            variant="outlined"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                currentPassword: e.target.value,
              })
            }
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        handleTogglePasswordVisibility("currentPassword")
                      }
                      edge="end"
                    >
                      {showPassword.currentPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            mb: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography width={150}>New Password</Typography>
          <TextField
            sx={{ flexGrow: 1, maxWidth: 500 }}
            type={showPassword.newPassword ? "text" : "password"}
            variant="outlined"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        handleTogglePasswordVisibility("newPassword")
                      }
                      edge="end"
                    >
                      {showPassword.newPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            mb: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography width={150}>Confirm Password</Typography>
          <TextField
            sx={{ flexGrow: 1, maxWidth: 500 }}
            type={showPassword.confirmNewPassword ? "text" : "password"}
            variant="outlined"
            value={passwordData.confirmNewPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirmNewPassword: e.target.value,
              })
            }
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        handleTogglePasswordVisibility("confirmNewPassword")
                      }
                      edge="end"
                    >
                      {showPassword.confirmNewPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        <Button
          sx={{ mb: 3, maxWidth: 700, width: "100%" }}
          variant="contained"
          color="primary"
          type="submit"
          disabled={
            !passwordData.currentPassword ||
            !passwordData.newPassword ||
            !passwordData.confirmNewPassword
          }
        >
          Update Password
        </Button>
      </form>
      <Divider />
    </Box>
  );
}

export default Security;
