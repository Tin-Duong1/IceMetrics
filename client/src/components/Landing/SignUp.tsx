import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import LogInBackground from "/LogInBackground.png";
import Logo from "/LogoBlack.svg";
import { FormEvent, useState } from "react";
import axios from "axios";

function SignUp() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/signup", formValues);

      if (response.status === 200) {
        setShowAlert(true);
        setAlertText("Success! Going to verification process...");
        setFormValues({ name: "", email: "", password: "" });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const statusCode = error.response.status;
          const detail = error.response.data.detail;

          setShowAlert(true);
          setAlertText(detail);
        }
      }
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: `url(${LogInBackground})`,
        backgroundSize: "cover",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        variant="elevation"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 4,
          borderRadius: { xs: 0, sm: 2 },
          width: { xs: "100vw", sm: 450 },
          height: { xs: "100vh", sm: "auto" },
          paddingInline: { xs: 10, sm: 6 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Link href="/">
            <img src={Logo} height={32} />
          </Link>
          <Typography variant="h4" fontWeight={600} sx={{ mt: 2 }}>
            Sign up
          </Typography>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}
        >
          {showAlert && (
            <Alert
              sx={{ borderRadius: 2 }}
              severity={
                alertText === "Success! Going to verification process..."
                  ? "success"
                  : "error"
              }
            >
              {alertText}
            </Alert>
          )}
          <FormControl>
            <FormLabel htmlFor="name">Name</FormLabel>
            <TextField
              id="name"
              type="text"
              name="name"
              placeholder="John Doe"
              autoCapitalize="words"
              autoFocus
              required
              fullWidth
              value={formValues.name}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              required
              fullWidth
              value={formValues.email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              required
              fullWidth
              value={formValues.password}
              onChange={handleChange}
            />
          </FormControl>
          <Button
            sx={{ mb: 4, mt: 2 }}
            type="submit"
            variant="contained"
            color="primary"
          >
            Sign Up
          </Button>
        </Box>
        <Divider>or</Divider>
        <Typography sx={{ textAlign: "center", my: 2 }}>
          Already have an account?{" "}
          {
            <Link href="/signin" variant="body2">
              Sign in
            </Link>
          }{" "}
        </Typography>
      </Card>
    </Box>
  );
}

export default SignUp;
