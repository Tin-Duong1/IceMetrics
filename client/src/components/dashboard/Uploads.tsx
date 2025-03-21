import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import axios from "axios";
import { UploadRounded } from "@mui/icons-material";

function Uploads() {
  const [video, setVideo] = useState<File | null>(null);
  const [videos, setVideos] = useState<
    {
      video_id: number;
      name: string;
      datetime_uploaded: string;
      duration: number;
    }[]
  >([]);
  const [videoName, setVideoName] = useState<string>("");

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setVideo(file || null);
  };

  const handleUpload = async () => {
    if (!video) {
      alert("Please select a video to upload.");
      return;
    }

    if (!videoName.trim()) {
      alert("Please provide a name for the video.");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);
    formData.append("name", videoName); // Include video name in the upload

    try {
      const token = localStorage.getItem("jwt_token"); // Retrieve token from localStorage
      await axios.post("/api/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert(`Video "${videoName}" uploaded successfully!`);
      setVideoName(""); // Reset video name input
      fetchVideos(); // Refresh the video list after upload
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video. Please try again.");
    }
  };

  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await axios.get("/api/videos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!id) {
      alert("Invalid video ID.");
      return;
    }
    try {
      const token = localStorage.getItem("jwt_token");
      await axios.delete(`/api/me/delete_video/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Video deleted successfully!");
      fetchVideos(); // Refresh the video list after deletion
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video. Please try again.");
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <Stack spacing={4} sx={{ padding: 2 }}>
      <Stack gap={4}>
        <Typography variant="h6" gutterBottom>
          Upload a Video
        </Typography>
        <Stack gap={1}>
          <TextField
            type="text"
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
            placeholder="Video Name"
            style={{ width: "100%" }}
          />
          <TextField type="file" onChange={handleVideoChange} fullWidth />
        </Stack>

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!video}
        >
          <UploadRounded />
          Upload Video
        </Button>
      </Stack>
      {/* Videos Table */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Your Videos
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Video Name</TableCell>
                <TableCell>Uploaded At</TableCell>
                <TableCell>Duration (seconds)</TableCell>
                <TableCell>Actions</TableCell> {/* New column for actions */}
              </TableRow>
            </TableHead>
            <TableBody>
              {videos.map((video) => (
                <TableRow key={video.video_id}>
                  <TableCell>{video.name}</TableCell>
                  <TableCell>
                    {new Date(video.datetime_uploaded).toLocaleString()}
                  </TableCell>
                  <TableCell>{video.duration}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(video.video_id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Stack>
  );
}

export default Uploads;
