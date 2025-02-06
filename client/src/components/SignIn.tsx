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

function SignIn() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [formValues, setFormValues] = useState({
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
      const response = await axios.post("/api/signin", formValues);

      if (response.status === 200) {
        const { access_token } = response.data;

        localStorage.setItem("jwt_token", access_token);

        setShowAlert(true);
        setAlertText("Logged In");
        setFormValues({ email: "", password: "" });

        window.location.href = "/dashboard";
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
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
            Sign in
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
              severity={alertText === "Logged In" ? "success" : "error"}
            >
              {alertText}
            </Alert>
          )}
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
              id="password"
              type="password"
              name="password"
              placeholder="••••••"
              autoComplete="current-password"
              required
              fullWidth
              value={formValues.password}
              onChange={handleChange}
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
              <Typography variant="body2">Remember me</Typography>
            </FormLabel>
          </FormControl>
          <Button type="submit" variant="contained" color="primary">
            Sign In
          </Button>
          <Link component="button" type="button" variant="body2" sx={{ my: 2 }}>
            Forgot your password?
          </Link>
        </Box>
        <Divider>or</Divider>
        <Typography sx={{ textAlign: "center", my: 2 }}>
          Dont have an account?{" "}
          {
            <Link href="/signup" variant="body2">
              Sign up
            </Link>
          }
        </Typography>
      </Card>
    </Box>
  );
}

export default SignIn;
