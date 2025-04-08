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
import { UploadRounded, FileUpload } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import axios from "axios";

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

  const onDrop = (acceptedFiles: File[]) => {
    setVideo(acceptedFiles[0] || null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [] }, 
    multiple: false,
  });

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
    formData.append("name", videoName);

    try {
      const token = localStorage.getItem("jwt_token"); // Retrieve token from localStorage
      await axios.post("/api/analyze_video", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert(`Video "${videoName}" uploaded successfully!`);
      setVideoName(""); // Reset video name input
      fetchVideos(); 
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
      fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video. Please try again.");
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <Stack
      spacing={4}
      direction={"row"}
      sx={{
        padding: 2,
        flexWrap: "wrap",
      }}
    >
      <Stack flexGrow={1}>
        <Box marginBottom={2}>
          <Typography variant="h6">Upload a Video</Typography>
          <Typography variant="caption">
            Upload a video file to analyze. Supported format is .mp4 or .mov.
          </Typography>
        </Box>
        <Stack gap={1} direction={"column"} marginBottom={2}>
          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed #ccc",
              borderRadius: 2,
              padding: 2,
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: isDragActive ? "#f0f0f0" : "transparent",
              ":hover": {
                backgroundColor: "#f0f0f0",
              },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "300px",
            }}
          >
            <input {...getInputProps()} />
            <FileUpload sx={{ fontSize: 40, color: "#888" }} />
            {video ? (
              <>
                <Typography variant="body1">{video.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {(video.size / (1024 * 1024)).toFixed(2)} MB
                </Typography>
              </>
            ) : isDragActive ? (
              <Typography>Drop the video here...</Typography>
            ) : (
              <Typography>
                Drag and drop a video file here, or click to select one
              </Typography>
            )}
          </Box>
          <TextField
            type="text"
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
            placeholder="Video Name"
            style={{ width: "100%" }}
          />
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
