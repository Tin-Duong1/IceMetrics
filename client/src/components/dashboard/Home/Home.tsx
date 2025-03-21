import { Stack } from "@mui/material";
import StatCard from "../Cards/StatCard";
import TopCards from "../Cards/TopCards";
import { useEffect, useState } from "react";

function Home() {
  const [userStats, setUserStats] = useState({
    number_of_videos: 0,
    total_duration: 0,
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const response = await fetch("/api/me/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUserStats(data);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };
    fetchUserStats();
  }, []);

  return (
    <Stack
      direction={"column"}
      spacing={2}
      sx={{ gap: 0, padding: 2, width: "100%" }}
    >
      <TopCards />
      <Stack direction={"row"} gap={2}>
        <StatCard
          title="Videos Uploaded"
          caption="videos"
          data={userStats.number_of_videos}
        />
        <StatCard
          title="Minutes Uploaded"
          caption="minutes"
          data={userStats.total_duration}
        />
      </Stack>
    </Stack>
  );
}

export default Home;
