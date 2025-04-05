import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import React, { ReactNode } from "react";

function StatCard2({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 4, boxShadow: 1, width: 400 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2">
          {title}
        </Typography>
        <Stack
          direction="column"
          sx={{ justifyContent: "space-between", gap: 1 }}
        >
          <Stack sx={{ justifyContent: "center" }}>
            <Stack
              direction={"row"}
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              {children}
            </Stack>
            <Typography variant="caption">{caption}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default StatCard2;
