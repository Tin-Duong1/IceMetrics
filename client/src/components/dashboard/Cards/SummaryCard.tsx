import { Box, Card, Typography, Divider } from "@mui/material";
import React from "react";

function SummaryCard({ summary }: { summary: string }) {
  return (
    <Card sx={{ padding: 3, borderRadius: 4, boxShadow: 3, width: '100%' }}>
      <Box>
        <Typography variant="h6">AI Analysis Summary</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          {summary}
        </Typography>
      </Box>
    </Card>
  );
}

export default SummaryCard;