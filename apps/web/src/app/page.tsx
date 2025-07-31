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
  useTheme,
  Fade,
  Zoom,
} from "@mui/material";
import {
  LocalFireDepartment,
  Restaurant,
  EmojiNature,
  FitnessCenter,
  TrendingUp,
  Smartphone,
} from "@mui/icons-material";
import Link from "next/link";
import { MACRO_CHART_COLORS, UI_COLORS } from "@/constants/app";

const Home = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
            : "linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)",
        py: { xs: 6, md: 12 },
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${MACRO_CHART_COLORS.carbs}, ${MACRO_CHART_COLORS.fat}, ${MACRO_CHART_COLORS.protein})`,
        },
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Fade in timeout={600}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 3,
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
              border: `1px solid ${theme.palette.divider}`,
              mb: { xs: 6, md: 8 },
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 4, md: 6 }}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box
                sx={{ maxWidth: 520, textAlign: { xs: "center", md: "left" } }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  mb={2}
                  justifyContent={{ xs: "center", md: "flex-start" }}
                >
                  <LocalFireDepartment
                    sx={{
                      color: MACRO_CHART_COLORS.calories,
                      fontSize: 48,
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                  />
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      fontWeight: "700",
                      background: `linear-gradient(45deg, ${MACRO_CHART_COLORS.calories}, ${MACRO_CHART_COLORS.carbs})`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                    }}
                  >
                    Calorie Counter
                  </Typography>
                </Stack>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 3,
                    color: "text.secondary",
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}
                >
                  Master Your Nutrition Journey
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 4, color: "text.secondary", fontSize: "1.1rem" }}
                >
                  Track your calories, macros, and meals effortlessly with our
                  modern, intuitive platform designed for your wellness success.
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
                      startIcon={<LocalFireDepartment />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        background: `linear-gradient(45deg, ${MACRO_CHART_COLORS.calories}, ${MACRO_CHART_COLORS.carbs})`,
                        boxShadow: UI_COLORS.shadows.medium,
                        fontWeight: "600",
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": {
                          background: `linear-gradient(45deg, ${MACRO_CHART_COLORS.carbs}, ${MACRO_CHART_COLORS.protein})`,
                          boxShadow: UI_COLORS.shadows.strong,
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease-in-out",
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
                        px: 4,
                        py: 1.5,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        fontWeight: "600",
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": {
                          borderColor: MACRO_CHART_COLORS.calories,
                          color: MACRO_CHART_COLORS.calories,
                          backgroundColor: `${MACRO_CHART_COLORS.calories}15`,
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease-in-out",
                      }}
                    >
                      Log In
                    </Button>
                  </Link>
                </Stack>
              </Box>

              {/* Hero visual - MacroChart inspired design */}
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${MACRO_CHART_COLORS.carbs}22, ${MACRO_CHART_COLORS.fat}22, ${MACRO_CHART_COLORS.protein}22)`,
                  border: `1px solid ${theme.palette.divider}`,
                  minWidth: 300,
                  animation: "float 6s ease-in-out infinite",
                  "@keyframes float": {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                  },
                }}
              >
                <Stack spacing={3} alignItems="center">
                  <Stack direction="row" spacing={2}>
                    <Restaurant
                      sx={{ color: MACRO_CHART_COLORS.carbs, fontSize: 32 }}
                    />
                    <EmojiNature
                      sx={{ color: MACRO_CHART_COLORS.fat, fontSize: 32 }}
                    />
                    <FitnessCenter
                      sx={{ color: MACRO_CHART_COLORS.protein, fontSize: 32 }}
                    />
                  </Stack>
                  <Typography variant="h6" fontWeight="600" textAlign="center">
                    Track Your Macros
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    Visualize your nutrition progress with beautiful charts and
                    insights
                  </Typography>
                </Stack>
              </Paper>
            </Stack>
          </Paper>
        </Fade>

        {/* Features Section */}
        <Typography variant="h4" textAlign="center" mb={4} fontWeight="600">
          Everything You Need to Succeed
        </Typography>
        <Grid container spacing={3} mb={8}>
          {[
            {
              title: "Quick Food Logging",
              description:
                "Add meals in seconds from our comprehensive food database or create custom entries with ease.",
              icon: <Restaurant sx={{ fontSize: 32 }} />,
              color: MACRO_CHART_COLORS.carbs,
            },
            {
              title: "Smart Goal Setting",
              description:
                "Define personalized macro and calorie targets that align with your health and fitness goals.",
              icon: <TrendingUp sx={{ fontSize: 32 }} />,
              color: MACRO_CHART_COLORS.fat,
            },
            {
              title: "Beautiful Analytics",
              description:
                "Visualize your nutrition trends with modern charts and insightful progress tracking.",
              icon: <LocalFireDepartment sx={{ fontSize: 32 }} />,
              color: MACRO_CHART_COLORS.calories,
            },
            {
              title: "Mobile Optimized",
              description:
                "Track your food anywhere with our responsive design that works perfectly on all devices.",
              icon: <Smartphone sx={{ fontSize: 32 }} />,
              color: MACRO_CHART_COLORS.protein,
            },
          ].map(({ title, description, icon, color }, index) => (
            <Grid size={{ xs: 12, sm: 6 }} key={title}>
              <Zoom in timeout={400 + index * 100}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: "100%",
                    background:
                      theme.palette.mode === "dark"
                        ? `linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)`
                        : `linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)`,
                    border: `1px solid ${color}22`,
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 8px 25px ${color}15`,
                      border: `1px solid ${color}44`,
                    },
                  }}
                >
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        color: color,
                        background: `${color}15`,
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {icon}
                    </Box>
                    <Typography variant="h6" fontWeight="600">
                      {title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {description}
                    </Typography>
                  </Stack>
                </Paper>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <Fade in timeout={800}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 3,
              textAlign: "center",
              background:
                theme.palette.mode === "dark"
                  ? `linear-gradient(135deg, ${MACRO_CHART_COLORS.calories}22, ${MACRO_CHART_COLORS.carbs}22)`
                  : `linear-gradient(135deg, ${MACRO_CHART_COLORS.calories}11, ${MACRO_CHART_COLORS.carbs}11)`,
              border: `1px solid ${theme.palette.divider}`,
              mb: 6,
            }}
          >
            <Stack spacing={3} alignItems="center">
              <LocalFireDepartment
                sx={{
                  color: MACRO_CHART_COLORS.calories,
                  fontSize: 48,
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                }}
              />
              <Typography
                variant="h4"
                mb={1}
                sx={{ fontWeight: "600", letterSpacing: "-0.02em" }}
              >
                Ready to Transform Your Nutrition?
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={2}>
                Join thousands of users who are already tracking their way to
                better health
              </Typography>
              <Link href="/signup" passHref>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<FitnessCenter />}
                  sx={{
                    px: 6,
                    py: 2,
                    background: `linear-gradient(45deg, ${MACRO_CHART_COLORS.calories}, ${MACRO_CHART_COLORS.carbs})`,
                    boxShadow: UI_COLORS.shadows.medium,
                    fontWeight: "600",
                    textTransform: "none",
                    borderRadius: 2,
                    fontSize: "1.1rem",
                    "&:hover": {
                      background: `linear-gradient(45deg, ${MACRO_CHART_COLORS.carbs}, ${MACRO_CHART_COLORS.protein})`,
                      boxShadow: UI_COLORS.shadows.strong,
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  Start Your Journey Today
                </Button>
              </Link>
            </Stack>
          </Paper>
        </Fade>

        {/* Footer */}
        <Box
          component="footer"
          textAlign="center"
          py={3}
          color="text.secondary"
          fontSize="0.875rem"
          sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
        >
          © {new Date().getFullYear()} Calorie Counter. Track • Analyze •
          Optimize
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
