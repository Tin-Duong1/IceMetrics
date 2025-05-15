import { Box, Container, Typography } from "@mui/material";
import HeroWave from "/hero-wave.png";

function Hero() {
  return (
    <Box sx={{ backgroundColor: "black", height: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          pt: 24,
          overflow: "hidden",
          background:
            "radial-gradient(ellipse at left top, #f9f9f9 0%,rgb(255, 255, 255) 62%, #d1d6db 100%)",
        }}
      >
        <Container
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mb: 10,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              textAlign: "center",
              fontWeight: 800,
              letterSpacing: -0.5,
              lineHeight: 1,
              fontSize: "clamp(3.5rem, 10vw, 4rem)",
            }}
          >
            Next-Level Hockey Analytics
          </Typography>
          <Typography
            textAlign="center"
            sx={{
              alignSelf: "center",
              width: { sm: "100%", md: "80%" },
              fontSize: "lg",
              lineHeight: 1.75,
            }}
          >
            Transform the way you analyze hockey with advanced insights,
            predictive data, and powerful tools built for coaches, analysts, and
            players.
          </Typography>
        </Container>
        <Box
          sx={{
            height: 600,
            backgroundImage: `url(${HeroWave})`,
            backgroundSize: "cover",
            backgroundPosition: "right",
          }}
        ></Box>
        <Box
          sx={{ height: 130, backgroundColor: "black", color: "white" }}
        ></Box>
      </Box>
    </Box>
  );
}

export default Hero;
