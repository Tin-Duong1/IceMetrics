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
          boxShadow: 6,
        }}
      >
        <Stack direction={"row"} gap={2} justifyContent={"space-between"}>
          <Stack
            direction={"column"}
            flexGrow={2}
            maxWidth={600}
            sx={{ justifyContent: "space-between" }}
          >
            <Box sx={{ paddingTop: 4 }}>
              <Typography
                variant="h4"
                fontWeight={"bold"}
                component="p"
                maxWidth={390}
              >
                Welcome to IceMetrics a Hockey Analytics Tool
              </Typography>
              <Typography variant="subtitle1">
                IceMetrics is a powerful analytics tool that helps you track
                your website's performance.
              </Typography>
            </Box>
            <Button variant="contained" sx={{ width: 120 }}>
              Learn More
            </Button>
          </Stack>
          <Box
            component="img"
            sx={{}}
            height={250}
            borderRadius={4}
            alt="Placeholder"
            src="https://placehold.co/600x400"
          />
        </Stack>
      </Card>
      <Card
        variant="outlined"
        sx={{
          flexGrow: 2,
          padding: 2,
          borderRadius: 4,
          width: 300,
          color: "white",
          boxShadow: 6,
          background: "radial-gradient(at left top, #010101, #7E7E7E)",
        }}
      ></Card>
    </Stack>
  );
}

export default TopCards;
