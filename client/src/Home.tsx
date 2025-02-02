import { Slide } from "@mui/material";
import Features from "./components/Features";
import Hero from "./components/Hero";
import AnimatedHome from "./components/animations/AnimatedLayout";
import AnimatedLayout from "./components/animations/AnimatedLayout";

function Home() {
  return (
    <AnimatedLayout>
      <Hero />
      <Features />
    </AnimatedLayout>
  );
}

export default Home;
