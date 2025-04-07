import { Box, Typography, Avatar, Container } from "@mui/material";
import Grid2 from '@mui/material/Grid2';
import LogInBackground from "/LogInBackground.png";
import { motion } from "framer-motion";
import AnimatedLayout from "./components/animations/AnimatedLayout";

const variants = {
  hidden: { opacity: 0, x: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 },
};

const teamMembers = [
  {
    name: "Jake Morgan",
    role: "Developer",
    image: "/profile1.jpg",
    description: "Frontend development and integration with backend APIs"
  },
  {
    name: "Tin Duong",
    role: "Developer",
    image: "/tinprofile.jpeg",
    description: "Focus on backend development, including database management and API development"
  }
];

function About() {
  return (
    <AnimatedLayout>
      <Box
        sx={{
          backgroundColor: "black",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <motion.div
          initial="hidden"
          animate="enter"
          exit="exit"
          variants={variants}
          transition={{ duration: 1, type: "easeInOut" }}
          className="relative"
          style={{ width: "100%" }}
        >
          <Box
            sx={{
              backgroundImage: `url(${LogInBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "50vh",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: "bold", 
                textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                textAlign: "center",
                maxWidth: "90%"
              }}
            >
              About IceMetrics
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mt: 2, 
                textAlign: "center", 
                textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
                maxWidth: "90%" 
              }}
            >
              Advanced hockey analytics for teams and coaches
            </Typography>
          </Box>
          
          <Container 
            maxWidth="lg" 
            sx={{ 
              py: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center", 
            }}
          >
            <Box sx={{ maxWidth: "800px", width: "100%", textAlign: "center" }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: "center" }}>
                Our Vision
              </Typography>
              <Typography variant="body1" component="p" sx={{ mb: 4, textAlign: "center" }}>
                IceMetrics is dedicated for hockey enthusiats who love the sport and want to 
                automate their gameplay. This application uses computer vision as well as AI models to analyze 
                gameplay for individuals to further improve their game. We give AI insight that allows for accurate
                analysis of gameplay, removing the need for manual analysis.
              </Typography>
              <Typography variant="body1" component="p" sx={{ mb: 6, textAlign: "center" }}>
                Our platform processes video footage to extract actionable metrics that can improve team performance, 
                player development, and game strategy in real-time.
              </Typography>
            </Box>
            
            <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 4, textAlign: "center" }}>
              Developers
            </Typography>
            
            <Grid2 container spacing={6} justifyContent="center" sx={{ width: "100%" }}>
              {teamMembers.map((member, index) => (
                <Grid2 key={index} sx={{ display: "flex", justifyContent: "center" }}>
                  <Box 
                    sx={{ 
                      textAlign: "center", 
                      maxWidth: "350px",
                      padding: "1rem",
                    }}
                  >
                    <Avatar 
                      src={member.image} 
                      alt={member.name}
                      sx={{ 
                        width: 180, 
                        height: 180, 
                        mx: "auto",
                        border: "4px solid #3f51b5",
                      }}
                    />
                    <Typography variant="h5" component="h3" sx={{ mt: 2, fontWeight: "bold" }}>
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
                      {member.role}
                    </Typography>
                    <Typography variant="body2">
                      {member.description}
                    </Typography>
                  </Box>
                </Grid2>
              ))}
            </Grid2>
          </Container>
        </motion.div>
      </Box>
    </AnimatedLayout>
  );
}

export default About;
