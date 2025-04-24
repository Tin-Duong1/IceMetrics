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
  SelectChangeEvent,
} from "@mui/material";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { LineChart, PieChart } from "@mui/x-charts";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { grey } from "@mui/material/colors";
import SummaryCard from "../Cards/SummaryCard";

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
    event: SelectChangeEvent
  ) => {
    const videoId = event.target.value as string;
    setSelectedVideo(videoId);

    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        console.error("No token found in localStorage.");
        return;
      }
      const response = await axios.get(`/api/video/${videoId}/analysis`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error("Error fetching analysis:", error);
      setAnalysis(null);
    }
  };

  // Check if analysis includes middle zone data
  const hasMiddleZone = analysis?.stats?.middle_zone !== undefined;

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
          <FormControl
            sx={{ m: 1, minWidth: 200 }}
            variant="standard"
            size="medium"
          >
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
        </Box>
      </Box>
      <Divider />
      <Box>
        {analysis ? (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: 2,
                gap: 4,
                flexWrap: { xs: "wrap", lg: "nowrap" },
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
                      marginBottom: 10,
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
                      secondary={`${
                        analysis?.stats?.average_players_per_second?.length
                          ? (
                              analysis.stats.average_players_per_second.reduce(
                                (sum: number, value: number) => sum + value,
                                0
                              ) /
                              analysis.stats.average_players_per_second.length
                            ).toFixed(3)
                          : "N/A"
                      } persons per second`}
                    />
                  </ListItem>
                  {hasMiddleZone && (
                    <>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Zone Distribution"
                          secondary={`Left: ${analysis.stats.left_side.percentage}% | Middle: ${analysis.stats.middle_zone.percentage}% | Right: ${analysis.stats.right_side.percentage}%`}
                        />
                      </ListItem>
                    </>
                  )}
                  <Divider />
                </List>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ textAlign: "center", marginTop: 2 }}
                >
                  Average Players Detected Over Time
                </Typography>
                <LineChart
                  xAxis={[
                    {
                      data: analysis?.stats?.average_players_per_second?.length
                        ? Array.from(
                            {
                              length:
                                analysis.stats.average_players_per_second
                                  .length,
                            },
                            (_, i) => (i + 1) * 50 // Generate x-axis labels as frame numbers
                          )
                        : [],
                      label: "Frame Number", // Add x-axis label
                    },
                  ]}
                  yAxis={[
                    {
                      data: [], // Placeholder for y-axis data
                      label: "Average Players Detected (per 50 frames)", // Add y-axis label
                    },
                  ]}
                  series={[
                    {
                      data: analysis?.stats?.average_players_per_second || [],
                      valueFormatter: (value) =>
                        value == null ? "NaN" : value.toFixed(2), // Format values to 2 decimal places
                    },
                  ]}
                  grid={{ vertical: true, horizontal: true }}
                  height={350}
                />
              </Box>
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
                        data: hasMiddleZone
                          ? [
                              {
                                value: analysis.stats.left_side.percentage,
                                label: "Left Side",
                                color: "#1E88E5", // Blue
                              },
                              {
                                value: analysis.stats.middle_zone.percentage,
                                label: "Middle Zone",
                                color: "#43A047", // Green
                              },
                              {
                                value: analysis.stats.right_side.percentage,
                                label: "Right Side",
                                color: "#D81B60", // Pink/Red
                              },
                            ]
                          : [
                              {
                                value: analysis.stats.left_side.percentage,
                                label: "Left Side",
                                color: "#1E88E5", // Blue
                              },
                              {
                                value: analysis.stats.right_side.percentage,
                                label: "Right Side",
                                color: "#D81B60", // Pink/Red
                              },
                            ],
                      },
                    ]}
                    height={200}
                    width={400}
                    slotProps={{
                      legend: {
                        direction: "row",
                        position: { vertical: "bottom", horizontal: "middle" },
                        padding: 0,
                      },
                    }}
                  />
                </Box>
              </Card>
              
              <Card sx={{ padding: 2, borderRadius: 4, boxShadow: 3, flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Zone Time Statistics
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Box sx={{ minWidth: 150, mb: 2 }}>
                    <Typography variant="subtitle2" color="#1E88E5">Left Side</Typography>
                    <Typography variant="body1">{Math.round(analysis.stats.left_side.time)} seconds</Typography>
                    <Typography variant="body2">{analysis.stats.left_side.percentage}%</Typography>
                  </Box>
                  
                  {hasMiddleZone && (
                    <Box sx={{ minWidth: 150, mb: 2 }}>
                      <Typography variant="subtitle2" color="#43A047">Middle Zone</Typography>
                      <Typography variant="body1">{Math.round(analysis.stats.middle_zone.time)} seconds</Typography>
                      <Typography variant="body2">{analysis.stats.middle_zone.percentage}%</Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ minWidth: 150, mb: 2 }}>
                    <Typography variant="subtitle2" color="#D81B60">Right Side</Typography>
                    <Typography variant="body1">{Math.round(analysis.stats.right_side.time)} seconds</Typography>
                    <Typography variant="body2">{analysis.stats.right_side.percentage}%</Typography>
                  </Box>
                </Stack>
              </Card>
            </Box>
            
            {analysis.summary && (
              <Box sx={{ mt: 4 }}>
                <SummaryCard summary={analysis.summary} />
              </Box>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <ImageNotSupportedIcon sx={{ fontSize: 200, color: grey[300] }} />
            <Typography
              variant="h6"
              sx={{ textAlign: "center", mt: 4, color: grey[500] }}
            >
              Select a video from the dropdown
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Analysis;
