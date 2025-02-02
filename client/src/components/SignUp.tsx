import {
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

function SignUp() {
  const [firstError, setFirstError] = useState(false);
  const [firstText, setFirstText] = useState("");

  const [lastError, setLastError] = useState(false);
  const [lastText, setLastText] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [emailText, setEmailText] = useState("");

  const [passwordError, setPasswordError] = useState(false);
  const [passwordText, setPasswordText] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (emailError || passwordError || firstError || lastError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);

    //IMPLEMENT THE SUBMISSION TO THE BACKEND
    //
    //
    //
    //
    //
  };

  const validateInput = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const firstName = document.getElementById("firstname") as HTMLInputElement;
    const lastName = document.getElementById("lastname") as HTMLInputElement;

    let valid = true;

    if (!firstName.value) {
      setFirstError(true);
      setFirstText("Enter your first name.");
    } else {
      setFirstError(false);
      setFirstText("");
    }

    if (!lastName.value) {
      setLastError(true);
      setLastText("Enter your last name.");
    } else {
      setLastError(false);
      setLastText("");
    }

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailText("Please enter a valid email adress.");
      valid = false;
    } else {
      setEmailError(false);
      setEmailText("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordText("Password must be at least 6 characters long.");
      valid = false;
    } else {
      setPasswordError(false);
      setPasswordText("");
    }

    return valid;
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              mt: 4,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="firstname">First Name</FormLabel>
              <TextField
                error={firstError}
                helperText={firstText}
                id="firstname"
                type="firstname"
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
                error={lastError}
                helperText={lastText}
                id="lastname"
                type="lastname"
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
              error={emailError}
              helperText={emailText}
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
              error={passwordError}
              helperText={passwordText}
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
                I want to recieve updates via email
              </Typography>
            </FormLabel>
          </FormControl>
          <Button
            sx={{ mb: 4 }}
            type="submit"
            variant="contained"
            color="primary"
            onClick={validateInput}
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
