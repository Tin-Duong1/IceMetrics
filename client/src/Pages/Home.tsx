import { Box } from "@mui/material";
import AnimatedLayout from "../Components/Animations/AnimatedLayout";
import Hero from "../Components/Landing/Hero";

function Home() {
  return (
    <AnimatedLayout>
      <Hero />
      <Box sx={{ height: 130, backgroundColor: "black", color: "white" }}></Box>
    </AnimatedLayout>
  );
}

export default Home;
