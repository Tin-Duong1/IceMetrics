import { Box, Card, Stack, Typography } from "@mui/material";
import { Gauge } from "@mui/x-charts";
import StatCard from "../Cards/StatCard";

function Home() {
  return (
    <Stack direction={"row"} sx={{ gap: 2, padding: 2, width: "100%" }}>
      <StatCard>
        <Typography variant="h6">Videos Uploaded</Typography>
        <Gauge
          width={200}
          height={200}
          value={1}
          valueMax={10}
          valueMin={0}
          innerRadius={50}
        />
      </StatCard>
      <StatCard>
        <Typography variant="h6">Videos Uploaded</Typography>
        <Gauge
          width={200}
          height={200}
          value={1}
          valueMax={10}
          valueMin={0}
          innerRadius={50}
        />
      </StatCard>
      <StatCard>
        <Typography variant="h6">Videos Uploaded</Typography>
        <Gauge
          width={200}
          height={200}
          value={1}
          valueMax={10}
          valueMin={0}
          innerRadius={50}
        />
      </StatCard>
      <StatCard>
        <Typography variant="h6">Videos Uploaded</Typography>
        <Gauge
          width={200}
          height={200}
          value={1}
          valueMax={10}
          valueMin={0}
          innerRadius={50}
        />
      </StatCard>
    </Stack>
  );
}

export default Home;
