import { useEffect, useState } from "react";
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
import { LineChart } from "@mui/x-charts";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { grey } from "@mui/material/colors";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

// Types
interface Video {
  video_id: number;
  name: string;
}

interface ZoneStats {
  percentage: number;
  time: number;
}

interface AnalysisData {
  name: string;
  duration: number;
  stats: {
    average_players_per_second: number[];
    left_side: ZoneStats;
    middle_zone: ZoneStats;
    right_side: ZoneStats;
  };
  summary?: string;
}

function Analysis() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

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

  const handleVideoChange = async (event: SelectChangeEvent) => {
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

  const renderZoneTime = (zone: ZoneStats, label: string, color: string) => (
    <Box
      sx={{
        width: "100px",
        height: "127px",
        backgroundColor: `rgba(${color}, ${zone.percentage / 100})`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="black">
        {label}
      </Typography>
      <Typography variant="caption" color="black">
        {zone.percentage}%
      </Typography>
    </Box>
  );

  const renderZoneStats = (zone: ZoneStats, label: string, color: string) => (
    <Box sx={{ minWidth: 150, mb: 2 }}>
      <Typography variant="subtitle2" color={color}>
        {label}
      </Typography>
      <Typography variant="body1">{Math.round(zone.time)} seconds</Typography>
      <Typography variant="body2">{zone.percentage}%</Typography>
    </Box>
  );

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
              {videos.map((video) => (
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
                                (sum, value) => sum + value,
                                0
                              ) /
                              analysis.stats.average_players_per_second.length
                            ).toFixed(3)
                          : "N/A"
                      } persons per second`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Zone Distribution"
                      secondary={`Left: ${analysis.stats.left_side.percentage}% | Neutral: ${analysis.stats.middle_zone.percentage}% | Right: ${analysis.stats.right_side.percentage}%`}
                    />
                  </ListItem>
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
                            (_, i) => (i + 1) * 50
                          )
                        : [],
                      label: "Frame Number",
                    },
                  ]}
                  yAxis={[
                    {
                      data: [],
                      label: "Average Players Detected (per 50 frames)",
                    },
                  ]}
                  series={[
                    {
                      data: analysis?.stats?.average_players_per_second || [],
                      valueFormatter: (value) =>
                        value == null ? "NaN" : value.toFixed(2),
                    },
                  ]}
                  grid={{ vertical: true, horizontal: true }}
                  height={350}
                />
              </Box>
            </Box>
            <Divider />
            <Box
              sx={{
                display: "flex",
                gap: 2,
                marginTop: 2,
                flexWrap: "wrap",
              }}
            >
              <Card
                sx={{
                  padding: 2,
                  borderRadius: 4,
                  boxShadow: 3,
                  width: "100%",
                }}
              >
                <Box sx={{ display: "flex" }}>
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
                  <Box
                    sx={{
                      display: "flex",
                      border: "1px solid grey",
                      borderRadius: 10,
                      marginLeft: "auto",
                      overflow: "hidden",
                    }}
                  >
                    {renderZoneTime(
                      analysis.stats.left_side,
                      "Left Zone",
                      "30, 136, 229"
                    )}
                    {renderZoneTime(
                      analysis.stats.middle_zone,
                      "Neutral Zone",
                      "67, 160, 71"
                    )}
                    {renderZoneTime(
                      analysis.stats.right_side,
                      "Right Zone",
                      "216, 27, 96"
                    )}
                  </Box>
                </Box>
              </Card>

              <Card
                sx={{
                  padding: 2,
                  borderRadius: 4,
                  boxShadow: 3,
                  flexGrow: 1,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Zone Time Statistics
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  justifyContent={"space-between"}
                >
                  {renderZoneStats(
                    analysis.stats.left_side,
                    "Left Zone",
                    "#1E88E5"
                  )}
                  {renderZoneStats(
                    analysis.stats.middle_zone,
                    "Neutral Zone",
                    "#43A047"
                  )}
                  {renderZoneStats(
                    analysis.stats.right_side,
                    "Right Zone",
                    "#D81B60"
                  )}
                </Stack>
              </Card>
            </Box>

            {analysis.summary && (
              <Card
                sx={{
                  padding: 3,
                  marginTop: 2,
                  borderRadius: 4,
                  boxShadow: 3,
                  width: "100%",
                }}
              >
                <Box>
                  <Typography variant="h6">AI Analysis Summary</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    {analysis.summary}
                  </Typography>
                </Box>
              </Card>
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
