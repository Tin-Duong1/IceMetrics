import { Box, Card } from "@mui/material";
import React from "react";

function StatCard({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: 280,
        height: 140,
        padding: 2,
        borderRadius: 2,
        border: 1,
      }}
    >
      {children}
    </Box>
  );
}

export default StatCard;
