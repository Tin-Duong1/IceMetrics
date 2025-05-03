import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
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
      <Card
        variant="outlined"
        sx={{
          flexGrow: 3,
          padding: 2,
          borderRadius: 4,
          boxShadow: 1,
        }}
      >
        <Stack direction={"row"} gap={2} justifyContent={"space-between"}>
          <Stack
            direction={"column"}
            flexGrow={2}
            maxWidth={600}
            sx={{ justifyContent: "space-between", padding: 2 }}
          >
            <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
              <Typography
                variant="h4"
                fontWeight={"bold"}
                component="p"
                maxWidth={390}
              >
                Welcome to IceMetrics a Hockey Analytics Tool
              </Typography>
              <Typography variant="subtitle1">
                IceMetrics is a hockey analytics tool that helps you analyze and
                visualize your hockey data. It provides a user-friendly
                interface for uploading, processing, and analyzing hockey
                videos.
              </Typography>
            </Box>
            <Button variant="contained" sx={{ width: 120, mt: 2 }}>
              Learn More
            </Button>
          </Stack>
        </Stack>
      </Card>
      <Stack direction={"row"} gap={2}>
        <Card
          variant="outlined"
          sx={{ flexGrow: 1, borderRadius: 4, boxShadow: 1 }}
        >
          <CardContent>
            <Typography component="h2" variant="subtitle2">
              Videos Uploaded
            </Typography>
            <Stack
              direction="column"
              sx={{ justifyContent: "space-between", flexGrow: 1, gap: 1 }}
            >
              <Stack sx={{ justifyContent: "center" }}>
                <Stack
                  direction={"row"}
                  sx={{ justifyContent: "space-between", alignItems: "center" }}
                >
                  <Typography variant="h4" component={"p"}>
                    {userStats.number_of_videos}
                  </Typography>
                </Stack>
                <Typography variant="caption">videos</Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
        <Card
          variant="outlined"
          sx={{ flexGrow: 1, borderRadius: 4, boxShadow: 1 }}
        >
          <CardContent>
            <Typography component="h2" variant="subtitle2">
              Minutes Uploaded
            </Typography>
            <Stack
              direction="column"
              sx={{ justifyContent: "space-between", flexGrow: 1, gap: 1 }}
            >
              <Stack sx={{ justifyContent: "center" }}>
                <Stack
                  direction={"row"}
                  sx={{ justifyContent: "space-between", alignItems: "center" }}
                >
                  <Typography variant="h4" component={"p"}>
                    {(userStats.total_duration / 60).toFixed(2)}
                  </Typography>
                </Stack>
                <Typography variant="caption">minutes</Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  );
}

export default Home;
