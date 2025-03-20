import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";

interface Video {
  id: number;
  name: string;
  duration: string;
  description: string;
}

function Uploads() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = () => {
    if (file) {
      const newVideo: Video = {
        id: Date.now(),
        name: file.name,
        duration: "Unknown", // Replace with actual duration if available
        description: "Sample description", // Replace with actual description if needed
      };
      setVideos((prev) => [...prev, newVideo]);
      setFile(null);
    }
  };

  const handleDelete = (id: number) => {
    setVideos((prev) => prev.filter((video) => video.id !== id));
  };

  return (
    <Stack spacing={4} sx={{ padding: 2 }}>
      {/* Upload Section */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Upload a Video
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Button variant="contained" onClick={handleUpload} disabled={!file}>
            Upload
          </Button>
        </Stack>
      </Box>

      {/* Uploaded Videos Section */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Uploaded Videos
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {videos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell>{video.name}</TableCell>
                  <TableCell>{video.description}</TableCell>
                  <TableCell>{video.duration}</TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      onClick={() => handleDelete(video.id)}
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
