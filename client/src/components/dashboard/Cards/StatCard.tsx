import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import React from "react";
import { T } from "react-router/dist/development/fog-of-war-CvttGpNz";

function StatCard() {
  return (
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
                Test
              </Typography>
              <Chip label="Test" />
            </Stack>
            <Typography variant="caption">Hello</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default StatCard;
