import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Divider,
  Alert,
  AlertColor,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

function PasswordChange() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const [message, setMessage] = useState<{ type: AlertColor; text: string }>({
    type: "success",
    text: "",
  });

  const handleTogglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleInputChange = (
    field: keyof typeof passwordData,
    value: string
  ) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt_token");
      await axios.post("/api/me/change_password", passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: "success", text: "Password updated successfully!" });
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage({ type: "error", text: "Failed to update password." });
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

  const renderPasswordField = (
    label: string,
    field: keyof typeof passwordData
  ) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        mb: 2,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography width={150}>{label}</Typography>
      <TextField
        sx={{ flexGrow: 1, maxWidth: 500 }}
        type={showPassword[field] ? "text" : "password"}
        variant="outlined"
        value={passwordData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => handleTogglePasswordVisibility(field)}
                edge="end"
              >
                {showPassword[field] ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h5" gutterBottom>
        Security Settings
      </Typography>
      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        {renderPasswordField("Current Password", "currentPassword")}
        {renderPasswordField("New Password", "newPassword")}
        {renderPasswordField("Confirm Password", "confirmNewPassword")}
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

export default PasswordChange;
