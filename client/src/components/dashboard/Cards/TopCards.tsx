import { Box, Button, Card, Stack, Typography } from "@mui/material";

function TopCards() {
  return (
    <Stack direction={"row"} gap={2}>
      <Card
        variant="outlined"
        sx={{
          flexGrow: 3,
          padding: 2,
          borderRadius: 4,
          boxShadow: 1,
        }}
      >
        <Stack direction={"row"} gap={2} justifyContent={"space-between"}>
          <Stack
            direction={"column"}
            flexGrow={2}
            maxWidth={600}
            sx={{ justifyContent: "space-between", padding: 2 }}
          >
            <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
              <Typography
                variant="h4"
                fontWeight={"bold"}
                component="p"
                maxWidth={390}
              >
                Welcome to IceMetrics a Hockey Analytics Tool
              </Typography>
              <Typography variant="subtitle1">
                IceMetrics is a hockey analytics tool that helps you analyze and
                visualize your hockey data. It provides a user-friendly
                interface for uploading, processing, and analyzing hockey
                videos.
              </Typography>
            </Box>
            <Button variant="contained" sx={{ width: 120, mt: 2 }}>
              Learn More
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}

export default TopCards;
