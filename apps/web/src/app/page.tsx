"use client";

import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Paper,
  Grid,
} from "@mui/material";
import Link from "next/link";

const Home = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, rgba(107,115,255,0.9) 0%, rgba(0,13,255,0.9) 100%)`,
        color: "rgba(255, 255, 255, 0.95)",
        py: { xs: 6, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 6, md: 8 }}
          alignItems="center"
          justifyContent="space-between"
          mb={{ xs: 8, md: 12 }}
        >
          <Box sx={{ maxWidth: 520, textAlign: { xs: "center", md: "left" } }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Master Your Nutrition <br /> with{" "}
              <Box component="span" sx={{ color: "#ffb74d" }}>
                Calorie Counter
              </Box>
            </Typography>
            <Typography
              variant="h6"
              sx={{ mt: 2, mb: 4, opacity: 0.88, fontWeight: 500 }}
            >
              Track your calories, macros, and meals effortlessly — anytime,
              anywhere.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent={{ xs: "center", md: "flex-start" }}
            >
              <Link href="/signup" passHref>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 6,
                    background: "linear-gradient(45deg, #ffb74d, #ff9800)",
                    boxShadow: "0 3px 12px rgba(255, 152, 0, 0.5)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #ff9800, #f57c00)",
                      boxShadow: "0 5px 18px rgba(245, 124, 0, 0.65)",
                    },
                    fontWeight: "bold",
                    textTransform: "none",
                  }}
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/login" passHref>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 6,
                    borderColor: "rgba(255, 255, 255, 0.75)",
                    color: "white",
                    fontWeight: "bold",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#ffb74d",
                      color: "#ffb74d",
                      backgroundColor: "rgba(255, 183, 77, 0.15)",
                    },
                  }}
                >
                  Log In
                </Button>
              </Link>
            </Stack>
          </Box>

          {/* Hero image placeholder */}
          <Box
            component="img"
            src="/calorie-counter-hero.png"
            alt="Calorie Counter Illustration"
            sx={{
              maxWidth: 600,
              width: "100%",
              borderRadius: 3,
              boxShadow: "0 6px 18px rgba(0, 0, 0, 0.18)",
              userSelect: "none",
              pointerEvents: "none",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.22))",
              animation: "float 6s ease-in-out infinite",
              "@keyframes float": {
                "0%, 100%": { transform: "translateY(0px)" },
                "50%": { transform: "translateY(-10px)" },
              },
            }}
          />
        </Stack>

        {/* Features Section */}
        <Grid container spacing={5} mb={10}>
          {[
            {
              title: "Quick & Easy Logging",
              description:
                "Add meals in seconds from our vast food library or create your own custom entries.",
              icon: "🔥",
            },
            {
              title: "Set Your Goals",
              description:
                "Define personalized macros and calories targets that fit your lifestyle.",
              icon: "🎯",
            },
            {
              title: "Insightful Progress",
              description:
                "Visualize your nutrition trends and stay motivated day by day.",
              icon: "📈",
            },
            {
              title: "Any Device, Anywhere",
              description:
                "Mobile-friendly design so you can log your food on the go.",
              icon: "📱",
            },
          ].map(({ title, description, icon }) => (
            <Grid item xs={12} sm={6} key={title}>
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  height: "100%",
                  backgroundColor: "rgba(255 255 255 / 0.12)",
                  color: "rgba(255,255,255,0.95)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 16px 32px rgba(255, 183, 77, 0.35)",
                  },
                }}
              >
                <Typography
                  variant="h4"
                  mb={2}
                  sx={{ fontWeight: "bold", userSelect: "none" }}
                >
                  {icon} {title}
                </Typography>
                <Typography sx={{ opacity: 0.85, fontSize: 16 }}>
                  {description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h4"
            mb={3}
            sx={{ fontWeight: "bold", letterSpacing: "-0.02em" }}
          >
            Ready to take control of your health?
          </Typography>
          <Link href="/signup" passHref>
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 7,
                py: 1.5,
                background: "linear-gradient(45deg, #ffb74d, #ff9800)",
                boxShadow: "0 5px 18px rgba(255, 152, 0, 0.65)",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  background: "linear-gradient(45deg, #ff9800, #f57c00)",
                  boxShadow: "0 7px 24px rgba(245, 124, 0, 0.85)",
                },
              }}
            >
              Create Your Free Account
            </Button>
          </Link>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          textAlign="center"
          py={3}
          color="rgba(255,255,255,0.65)"
          fontSize="0.875rem"
          sx={{ borderTop: "1px solid rgba(255,255,255,0.18)" }}
        >
          © {new Date().getFullYear()} Calorie Counter. All rights reserved.
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
