import React, { useState } from "react";
import {
  Box,
  IconButton,
  SxProps,
  Typography,
  Paper,
  Tooltip,
  useTheme,
} from "@mui/material";
import { ChevronLeft, ChevronRight, Today } from "@mui/icons-material";
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
        p: 1.5,
        borderRadius: 2,
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)"
            : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        border: `1px solid ${theme.palette.divider}`,
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        position: "relative",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: theme.shadows[3],
        },
        ...sx,
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="group"
      aria-label="Date picker"
    >
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
          width: 180, // Fixed width to prevent size changes
          px: 1,
        }}
      >
        <Typography
          variant="body1"
          fontWeight="600"
          sx={{
            lineHeight: 1,
            color: theme.palette.text.primary,
          }}
        >
          {formattedDate}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 0.25,
            fontWeight: 500,
            height: 16, // Fixed height to prevent layout shift
            color:
              dateLabel === "Today"
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
          }}
        >
          {dateLabel || dayOfWeek}
        </Typography>
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
      {showQuickActions && (
        <Tooltip title="Jump to today (Home key)" arrow>
          <IconButton
            size="small"
            onClick={handleToday}
            aria-label="Go to today"
            sx={{
              ml: 1,
              borderRadius: 2,
              backgroundColor: selectedDayjs.isToday()
                ? theme.palette.primary.main + "20"
                : theme.palette.primary.main + "10",
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
