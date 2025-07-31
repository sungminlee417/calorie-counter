import React, { useState } from "react";
import {
  Box,
  IconButton,
  SxProps,
  Typography,
  Paper,
  Tooltip,
  useTheme,
  Chip,
  Fade,
  Zoom,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  CalendarToday,
  Today,
  Event,
} from "@mui/icons-material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface ArrowDatePickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
  sx?: SxProps;
  minDate?: Date;
  maxDate?: Date;
  showQuickActions?: boolean;
}

const ArrowDatePicker: React.FC<ArrowDatePickerProps> = ({
  selectedDate,
  onChange,
  sx,
  minDate,
  maxDate,
  showQuickActions = true,
}) => {
  const theme = useTheme();
  const [isAnimating, setIsAnimating] = useState<"prev" | "next" | null>(null);

  const selectedDayjs = dayjs(selectedDate);
  const today = dayjs();

  // Format the date with better readability
  const formattedDate = selectedDayjs.format("MMM D, YYYY");
  const dayOfWeek = selectedDayjs.format("dddd");

  // Get relative date information
  const getDateLabel = () => {
    if (selectedDayjs.isToday()) return "Today";
    if (selectedDayjs.isYesterday()) return "Yesterday";
    if (selectedDayjs.isSame(today.add(1, "day"), "day")) return "Tomorrow";
    return null;
  };

  const dateLabel = getDateLabel();

  // Check if navigation should be disabled
  const isPrevDisabled = minDate
    ? selectedDayjs.isSameOrBefore(dayjs(minDate), "day")
    : false;
  const isNextDisabled = maxDate
    ? selectedDayjs.isSameOrAfter(dayjs(maxDate), "day")
    : false;

  const handlePrev = () => {
    if (isPrevDisabled) return;
    setIsAnimating("prev");
    setTimeout(() => setIsAnimating(null), 300);
    onChange(selectedDayjs.subtract(1, "day").toDate());
  };

  const handleNext = () => {
    if (isNextDisabled) return;
    setIsAnimating("next");
    setTimeout(() => setIsAnimating(null), 300);
    onChange(selectedDayjs.add(1, "day").toDate());
  };

  const handleToday = () => {
    if (selectedDayjs.isToday()) return;
    onChange(today.toDate());
  };

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      handlePrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      handleNext();
    } else if (event.key === "Home") {
      event.preventDefault();
      handleToday();
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 3,
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)"
            : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        border: `1px solid ${theme.palette.divider}`,
        display: "flex",
        alignItems: "center",
        gap: 2,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: theme.shadows[4],
          transform: "translateY(-1px)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        },
        ...sx,
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="group"
      aria-label="Date picker"
    >
      {/* Calendar Icon */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          color: theme.palette.primary.main,
        }}
      >
        <CalendarToday sx={{ fontSize: 20 }} />
      </Box>

      {/* Previous Day Button */}
      <Tooltip title="Previous day (← arrow key)" arrow>
        <span>
          <IconButton
            size="small"
            onClick={handlePrev}
            disabled={isPrevDisabled}
            aria-label="Previous day"
            sx={{
              borderRadius: 2,
              transition: "all 0.2s ease-in-out",
              "&:hover:not(:disabled)": {
                backgroundColor: theme.palette.primary.main + "15",
                transform: "scale(1.1)",
              },
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            <ChevronLeft
              sx={{
                color: isPrevDisabled ? "action.disabled" : "primary.main",
                transition: "color 0.2s ease-in-out",
              }}
            />
          </IconButton>
        </span>
      </Tooltip>

      {/* Date Display */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 140,
          position: "relative",
        }}
      >
        <Fade
          in={!isAnimating}
          timeout={300}
          style={{
            transitionDelay: isAnimating ? "0ms" : "150ms",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h6"
              fontWeight="600"
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.text.secondary})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.2,
              }}
            >
              {formattedDate}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 0.5,
                fontWeight: 500,
              }}
            >
              {dayOfWeek}
            </Typography>
          </Box>
        </Fade>

        {/* Date Label Chip */}
        {dateLabel && (
          <Zoom in timeout={400}>
            <Chip
              size="small"
              label={dateLabel}
              icon={dateLabel === "Today" ? <Today /> : <Event />}
              color={dateLabel === "Today" ? "primary" : "default"}
              sx={{
                position: "absolute",
                top: -8,
                right: -20,
                fontSize: "0.7rem",
                height: 20,
                "& .MuiChip-icon": {
                  fontSize: 12,
                },
              }}
            />
          </Zoom>
        )}
      </Box>

      {/* Next Day Button */}
      <Tooltip title="Next day (→ arrow key)" arrow>
        <span>
          <IconButton
            size="small"
            onClick={handleNext}
            disabled={isNextDisabled}
            aria-label="Next day"
            sx={{
              borderRadius: 2,
              transition: "all 0.2s ease-in-out",
              "&:hover:not(:disabled)": {
                backgroundColor: theme.palette.primary.main + "15",
                transform: "scale(1.1)",
              },
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            <ChevronRight
              sx={{
                color: isNextDisabled ? "action.disabled" : "primary.main",
                transition: "color 0.2s ease-in-out",
              }}
            />
          </IconButton>
        </span>
      </Tooltip>

      {/* Quick Actions */}
      {showQuickActions && !selectedDayjs.isToday() && (
        <Tooltip title="Jump to today (Home key)" arrow>
          <IconButton
            size="small"
            onClick={handleToday}
            aria-label="Go to today"
            sx={{
              ml: 1,
              borderRadius: 2,
              backgroundColor: theme.palette.primary.main + "10",
              color: theme.palette.primary.main,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: theme.palette.primary.main + "20",
                transform: "scale(1.1)",
              },
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            <Today sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      )}

      {/* Animation Indicator */}
      {isAnimating && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: isAnimating === "prev" ? -10 : "calc(100% + 10px)",
            transform: "translateY(-50%)",
            width: 2,
            height: 20,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 1,
            animation: "pulse 0.3s ease-in-out",
            "@keyframes pulse": {
              "0%": { opacity: 0, transform: "translateY(-50%) scale(0.8)" },
              "50%": { opacity: 1, transform: "translateY(-50%) scale(1.2)" },
              "100%": { opacity: 0, transform: "translateY(-50%) scale(0.8)" },
            },
          }}
        />
      )}
    </Paper>
  );
};

export default ArrowDatePicker;
