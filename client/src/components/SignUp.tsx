import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
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
  const [signupError, setSignupError] = useState(true);
  const [signupMessage, setSignupMessage] = useState("wxaxawx");
  const [emailUsed, setEmailUsed] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const response = await axios.post("/api/signup", {
        firstName: data.get("firstname"),
        lastName: data.get("lastname"),
        email: data.get("email"),
        password: data.get("password"),
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const statusCode = error.response.status;

          if (statusCode === 409) {
            setSignupError(true);
            setSignupMessage("Email is already in use.");
          }
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
          {signupMessage && (
            <Alert
              sx={{ borderRadius: 2 }}
              severity={signupError ? "error" : "success"}
            >
              {signupMessage}
            </Alert>
          )}
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="firstname">First Name</FormLabel>
              <TextField
                id="firstname"
                type="text"
                name="firstname"
                placeholder="John"
                autoCapitalize="words"
                autoFocus
                required
                fullWidth
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="lastname">Last Name</FormLabel>
              <TextField
                id="lastname"
                type="text"
                name="lastname"
                placeholder="Doe"
                autoCapitalize="words"
                required
                fullWidth
              />
            </FormControl>
          </Box>
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
            />
          </FormControl>
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <Checkbox sx={{ height: 10, width: 10 }} />
            <FormLabel htmlFor="remember">
              <Typography variant="body2">
                I want to receive updates via email
              </Typography>
            </FormLabel>
          </FormControl>
          <Button
            sx={{ mb: 4 }}
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
