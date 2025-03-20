import { Stack } from "@mui/material";
import StatCard from "../Cards/StatCard";
import TopCards from "../Cards/TopCards";

function Home() {
  return (
    <Stack
      direction={"column"}
      spacing={2}
      sx={{ gap: 0, padding: 2, width: "100%" }}
    >
      <TopCards />
      <Stack direction={"row"} gap={2}>
        <StatCard />
        <StatCard />
        <StatCard />
      </Stack>
    </Stack>
  );
}

export default Home;
