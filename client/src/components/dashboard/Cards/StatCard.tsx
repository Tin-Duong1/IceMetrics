import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import React from "react";

function StatCard({
  title,
  caption,
  data,
}: {
  title: string;
  caption: string;
  data: any;
}) {
  return (
    <Card
      variant="outlined"
      sx={{ flexGrow: 1, borderRadius: 4, boxShadow: 1 }}
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2">
          {title}
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
                {data}
              </Typography>
            </Stack>
            <Typography variant="caption">{caption}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default StatCard;
