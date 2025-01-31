import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import LogInBackground from "/LogInBackground.png";
import Logo from "/LogoBlack.svg";

function SignIn() {
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
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
