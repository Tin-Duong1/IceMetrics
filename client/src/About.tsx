import { Box } from "@mui/material";
import LogInBackground from "/LogInBackground.png";
import { motion } from "framer-motion";
import AnimatedLayout from "./components/animations/AnimatedLayout";

const variants = {
  hidden: { opacity: 0, x: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 },
};

function About() {
  return (
    <AnimatedLayout>
      <Box
        sx={{
          backgroundColor: "black",
          color: "white",
          height: "100vh",
        }}
      >
        <motion.div
          initial="hidden"
          animate="enter"
          exit="exit"
          variants={variants}
          transition={{ duration: 1, type: "easeInOut" }}
          className="relative"
        >
          <Box
            sx={{
              backgroundImage: `url(${LogInBackground})`,
              backgroundSize: "cover",
              height: "100vh",
              width: "100vw",
            }}
          >
            Hello
          </Box>
        </motion.div>
      </Box>
    </AnimatedLayout>
  );
}

export default About;
