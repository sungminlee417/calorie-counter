"use client";

import React, { useState } from "react";
import {
  Typography,
  Box,
  Stack,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  useTheme,
  Fade,
  Skeleton,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Search,
  Restaurant,
  TuneRounded,
  SaveAlt,
  Public,
  Storage,
} from "@mui/icons-material";

import useServerFoods from "@/hooks/useServerFoods";
import useDebounce from "@/hooks/useDebounce";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { FoodSourceType, Food } from "@/types/food-provider";
import {
  SEARCH_DEBOUNCE_DELAY,
  MACRO_CHART_COLORS,
  UI_COLORS,
} from "@/constants/app";
import FoodSourceBadge from "./FoodSourceBadge";
// For server-side, we check API availability differently
const checkServerProviders = () => ({
  fdc: true, // Server-side API route handles the check
});

const Foods = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<FoodSourceType[]>([
    FoodSourceType.INTERNAL,
    FoodSourceType.FDC_USDA,
  ]);
  const [enableDeduplication, setEnableDeduplication] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(searchTerm.trim(), SEARCH_DEBOUNCE_DELAY);

  const {
    foods,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    stats,
    getProviderInfo,
    saveExternalFood,
  } = useServerFoods({
    search: debouncedSearch,
    providers: selectedProviders,
    enableDeduplication,
  });

  const bottomRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const providerInfo = getProviderInfo();
  const externalProviders = checkServerProviders();

  const handleProviderToggle = (provider: FoodSourceType) => {
    setSelectedProviders((prev) =>
      prev.includes(provider)
        ? prev.filter((p) => p !== provider)
        : [...prev, provider]
    );
  };

  const handleSaveExternalFood = async (food: Food) => {
    try {
      await saveExternalFood.mutateAsync(food);
    } catch (error) {
      console.error("Failed to save external food:", error);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          background:
            theme.palette.mode === "dark"
              ? UI_COLORS.gradients.neutral.dark
              : UI_COLORS.gradients.neutral.light,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: `1px solid ${theme.palette.divider}`,
            background: `linear-gradient(90deg, ${MACRO_CHART_COLORS.calories}15, ${MACRO_CHART_COLORS.carbs}15, ${MACRO_CHART_COLORS.fat}15, ${MACRO_CHART_COLORS.protein}15)`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Restaurant
              sx={{ color: MACRO_CHART_COLORS.carbs, fontSize: 28 }}
            />
            <Typography
              variant="h5"
              fontWeight="600"
              sx={{
                flex: 1,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Food Database
            </Typography>
            <Tooltip title="Toggle filters" arrow>
              <IconButton
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  backgroundColor: `${theme.palette.primary.main}15`,
                  color: theme.palette.primary.main,
                  borderRadius: "50%", // Fully circular
                  width: 40,
                  height: 40,
                  "&:hover": {
                    backgroundColor: `${theme.palette.primary.main}25`,
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <TuneRounded />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Search Input */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search across all food databases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: MACRO_CHART_COLORS.carbs }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: showFilters ? 2 : 0,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.8)",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: MACRO_CHART_COLORS.carbs,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: MACRO_CHART_COLORS.carbs,
                },
              },
            }}
          />

          {/* Filter Panel */}
          {showFilters && (
            <Fade in={showFilters}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background:
                    theme.palette.mode === "dark" ? "#2a2a2a" : "#ffffff",
                }}
              >
                <Typography variant="subtitle2" mb={2} fontWeight="600">
                  Data Sources
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="center"
                >
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {providerInfo.availableProviders.map((provider) => (
                        <Chip
                          key={provider}
                          label={
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={0.5}
                            >
                              {provider === FoodSourceType.INTERNAL ? (
                                <Storage sx={{ fontSize: 14 }} />
                              ) : (
                                <Public sx={{ fontSize: 14 }} />
                              )}
                              <span>
                                {provider === FoodSourceType.INTERNAL
                                  ? "Personal"
                                  : "USDA"}
                              </span>
                            </Stack>
                          }
                          variant={
                            selectedProviders.includes(provider)
                              ? "filled"
                              : "outlined"
                          }
                          onClick={() => handleProviderToggle(provider)}
                          sx={{
                            borderColor: MACRO_CHART_COLORS.carbs,
                            "&.MuiChip-filled": {
                              backgroundColor: `${MACRO_CHART_COLORS.carbs}25`,
                              color: MACRO_CHART_COLORS.carbs,
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>

                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={enableDeduplication}
                          onChange={(e) =>
                            setEnableDeduplication(e.target.checked)
                          }
                          color="primary"
                        />
                      }
                      label="Remove duplicates"
                    />
                  </Box>
                </Stack>

                {!externalProviders.fdc && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Add your FDC_API_KEY to environment variables to enable USDA
                    food database search.
                  </Alert>
                )}
              </Paper>
            </Fade>
          )}
        </Box>

        {/* Stats Bar */}
        {stats.totalResults > 0 && (
          <Box
            sx={{
              px: 3,
              py: 1,
              borderBottom: `1px solid ${theme.palette.divider}`,
              backgroundColor:
                theme.palette.mode === "dark" ? "#1a1a1a" : "#f8f9fa",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
              sx={{ width: "100%", minWidth: 0 }}
            >
              <Typography variant="caption" color="text.secondary">
                {stats.totalResults} results
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
                sx={{ minWidth: 0 }}
              >
                {Object.entries(stats.sourceBreakdown).map(
                  ([source, count]) => (
                    <Stack
                      key={source}
                      direction="row"
                      spacing={0.5}
                      alignItems="center"
                    >
                      <FoodSourceBadge
                        source={source as FoodSourceType}
                        variant="outlined"
                        showTooltip={false}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {count as number}
                      </Typography>
                    </Stack>
                  )
                )}
              </Stack>
            </Stack>
          </Box>
        )}

        {/* Error Display */}
        {error && (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">
              {error.isProviderError ? (
                <>
                  <strong>{error.provider}:</strong> {error.message}
                </>
              ) : (
                error.message
              )}
            </Alert>
          </Box>
        )}

        {/* Content Area */}
        <Box
          sx={{
            maxHeight: 500,
            overflowY: "auto",
            p: 2,
          }}
        >
          {isLoading ? (
            <Stack spacing={2}>
              {[...Array(4)].map((_, idx) => (
                <Fade in timeout={300 + idx * 100} key={idx}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background:
                        theme.palette.mode === "dark" ? "#2a2a2a" : "#ffffff",
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Box flex={1}>
                        <Skeleton width="60%" height={24} />
                        <Skeleton width="80%" height={20} sx={{ mt: 0.5 }} />
                      </Box>
                      <Skeleton variant="rectangular" width={60} height={20} />
                    </Stack>
                  </Paper>
                </Fade>
              ))}
            </Stack>
          ) : !foods?.length ? (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 2,
                background: `${MACRO_CHART_COLORS.carbs}08`,
                border: `1px dashed ${MACRO_CHART_COLORS.carbs}44`,
              }}
            >
              <Stack alignItems="center" spacing={2}>
                <Box sx={{ color: MACRO_CHART_COLORS.carbs, fontSize: 48 }}>
                  <Restaurant />
                </Box>
                <Typography variant="h6" color="text.secondary">
                  {searchTerm ? "No foods found" : "Start typing to search"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm
                    ? `No results for "${searchTerm}". Try a different search term.`
                    : "Search across your personal foods and the USDA nutrition database"}
                </Typography>
              </Stack>
            </Paper>
          ) : (
            <Stack spacing={1}>
              {foods.map((food, idx) => (
                <Fade
                  in
                  timeout={200 + idx * 50}
                  key={`${food.source}-${food.external_id || food.id}`}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background:
                        theme.palette.mode === "dark" ? "#2a2a2a" : "#ffffff",
                      border: `1px solid ${theme.palette.divider}`,
                      "&:hover": {
                        boxShadow: `0 4px 12px ${MACRO_CHART_COLORS.carbs}15`,
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Restaurant sx={{ color: MACRO_CHART_COLORS.carbs }} />

                      <Box flex={1}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          mb={0.5}
                        >
                          <Typography variant="subtitle1" fontWeight="600">
                            {food.name}
                          </Typography>
                          <FoodSourceBadge source={food.source} />
                        </Stack>

                        <Typography variant="body2" color="text.secondary">
                          {food.brand && `${food.brand} • `}
                          {food.calories} kcal per {food.serving_size}
                          {food.serving_unit}
                          {" • "}
                          P: {food.protein}g C: {food.carbs}g F: {food.fat}g
                        </Typography>
                      </Box>

                      {food.source !== FoodSourceType.INTERNAL && (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<SaveAlt />}
                          onClick={() => handleSaveExternalFood(food)}
                          disabled={saveExternalFood.isPending}
                          sx={{
                            borderColor: MACRO_CHART_COLORS.fat,
                            color: MACRO_CHART_COLORS.fat,
                            "&:hover": {
                              borderColor: MACRO_CHART_COLORS.protein,
                              backgroundColor: `${MACRO_CHART_COLORS.fat}08`,
                            },
                          }}
                        >
                          Save
                        </Button>
                      )}
                    </Stack>
                  </Paper>
                </Fade>
              ))}

              {isFetchingNextPage && (
                <Box display="flex" justifyContent="center" py={2}>
                  <CircularProgress
                    size={24}
                    sx={{ color: MACRO_CHART_COLORS.carbs }}
                  />
                </Box>
              )}

              {hasNextPage && <div ref={bottomRef} />}
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Foods;
