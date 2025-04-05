import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Divider,
  Card,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import RinkSplitHeatmap from "../RinkHeatmap";
import StatCard2 from "../Cards/StatCard2";
import { LineChart, PieChart } from "@mui/x-charts";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function Analysis() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const response = await axios.get("/api/videos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoChange = async (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const videoId = event.target.value as string;
    setSelectedVideo(videoId);

    try {
      const token = localStorage.getItem("jwt_token");
      const response = await axios.get(`/api/video/${videoId}/analysis`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error("Error fetching analysis:", error);
      setAnalysis("Failed to fetch analysis.");
    }
  };

  const generateHeatmapData = () => {
    if (!analysis || !analysis.stats) return null;

    return {
      labels: ["Left Side", "Right Side"],
      datasets: [
        {
          label: "Time (seconds)",
          data: [analysis.stats.left_side.time, analysis.stats.right_side.time],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)",
          ],
        },
        {
          label: "Percentage (%)",
          data: [
            analysis.stats.left_side.percentage,
            analysis.stats.right_side.percentage,
          ],
          backgroundColor: [
            "rgba(75, 192, 192, 0.3)",
            "rgba(255, 99, 132, 0.3)",
          ],
        },
      ],
    };
  };

  const heatmapData = generateHeatmapData();

  const dataset = [
    { x: "00:00", y: 10 },
    { x: "00:10", y: 20 },
    { x: "00:20", y: 15 },
    { x: "00:30", y: 25 },
    { x: "00:40", y: 30 },
    { x: "00:50", y: 20 },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Analytics</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FormControl sx={{ m: 1, minWidth: 200 }} size="medium">
            <InputLabel id="demo-select-small-label">Video</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={selectedVideo}
              label="Video"
              onChange={handleVideoChange}
            >
              {videos.map((video: { video_id: number; name: string }) => (
                <MenuItem
                  key={video.video_id}
                  value={video.video_id.toString()}
                >
                  {video.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" sx={{ height: 42, background: "red" }}>
            Delete Video
          </Button>
        </Box>
      </Box>
      <Divider />
      <Box>
        {analysis ? (
          <Box>
            <Box
              sx={{
                display: "flex",
                padding: 2,
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
                <List sx={{ minWidth: 300 }}>
                  <Card
                    sx={{
                      boxShadow: 0,
                      display: "flex",
                      border: "0.5px solid grey",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <Typography
                      sx={{
                        paddingBlock: 1,
                      }}
                      variant="h5"
                    >
                      Video Analytics
                    </Typography>
                  </Card>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Video Name"
                      secondary={analysis.name}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Total Time"
                      secondary={`${analysis.duration} seconds`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Objects"
                      secondary={`22.212 objects per second`}
                    />
                  </ListItem>
                  <Divider />
                </List>
              </Box>
              <LineChart
                xAxis={[
                  {
                    data: (() => {
                      const duration = analysis?.duration || 0;
                      let interval = 1;

                      if (duration > 300) interval = 30;
                      else if (duration > 100) interval = 10;
                      else if (duration > 50) interval = 5;

                      return Array.from(
                        { length: Math.ceil(duration / interval) },
                        (_, i) => i * interval
                      );
                    })(),
                  },
                ]}
                series={[
                  {
                    data: (() => {
                      const duration = analysis?.duration || 0;
                      let interval = 1;

                      if (duration > 300) interval = 30;
                      else if (duration > 100) interval = 10;
                      else if (duration > 50) interval = 5;

                      return Array.from(
                        { length: Math.ceil(duration / interval) },
                        () => parseFloat((Math.random() * 10).toFixed(2))
                      );
                    })(),
                    valueFormatter: (value) =>
                      value == null ? "NaN" : value.toString(),
                  },
                ]}
                grid={{ vertical: true, horizontal: true }}
                height={400}
              />
            </Box>
            <Divider />
            <Box
              sx={{ display: "flex", gap: 2, marginTop: 2, flexWrap: "wrap" }}
            >
              <Card sx={{ padding: 2, borderRadius: 4, boxShadow: 3 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ width: 77 }}>Zone Time</Typography>
                    <Typography variant="caption">Percentage</Typography>
                  </Box>
                  <PieChart
                    series={[
                      {
                        innerRadius: "60%",
                        outerRadius: "100%",
                        paddingAngle: 5,
                        cornerRadius: 5,
                        data: [
                          {
                            value: analysis.stats.left_side.percentage,
                            label: "Left Side",
                            color: "blue",
                          },
                          {
                            value: analysis.stats.right_side.percentage,
                            label: "Right Side",
                            color: "lightblue",
                          },
                        ],
                      },
                    ]}
                    height={150}
                    width={400}
                  />
                </Box>
              </Card>
            </Box>
          </Box>
        ) : (
          <Typography>Select a video to view its analysis.</Typography>
        )}
      </Box>
    </Box>
  );
}

export default Analysis;
