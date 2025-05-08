import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

const Feedback: React.FC = () => {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (feedback.trim()) {
      console.log("Feedback submitted:", feedback);
      setSubmitted(true);
      setFeedback("");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Feedback
      </Typography>
      {submitted ? (
        <Typography variant="body1" color="success.main">
          Thank you for your feedback!
        </Typography>
      ) : (
        <>
          <Typography variant="body1" gutterBottom>
            We value your feedback. Please let us know your thoughts below.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Your Feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!feedback.trim()}
          >
            Submit
          </Button>
        </>
      )}
    </Box>
  );
};

export default Feedback;
