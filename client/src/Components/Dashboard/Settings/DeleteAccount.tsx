import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";

function DeleteAccount() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await axios.delete("api/me/delete_account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(response.data.detail);
      localStorage.removeItem("jwt_token");
      window.location.href = "/";
    } catch (error) {
      alert("An error occurred");
    } finally {
      handleClose();
    }
  };

  return (
    <>
      <Button fullWidth variant="contained" color="error" onClick={handleOpen}>
        Delete Account
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DeleteAccount;
