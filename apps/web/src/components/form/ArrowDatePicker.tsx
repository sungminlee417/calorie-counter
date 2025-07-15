import React from "react";
import { Box, IconButton, SxProps, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import dayjs from "dayjs";

interface ArrowDatePickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
  sx: SxProps;
}

const ArrowDatePicker: React.FC<ArrowDatePickerProps> = ({
  selectedDate,
  onChange,
  sx,
}) => {
  const formattedDate = dayjs(selectedDate).format("MMM D, YYYY");

  const handlePrev = () => {
    onChange(dayjs(selectedDate).subtract(1, "day").toDate());
  };

  const handleNext = () => {
    onChange(dayjs(selectedDate).add(1, "day").toDate());
  };

  return (
    <Box display="flex" alignItems="center" gap={1} sx={sx}>
      <IconButton size="small" onClick={handlePrev} aria-label="Previous day">
        <ChevronLeft />
      </IconButton>
      <Typography variant="body1" sx={{ minWidth: 100, textAlign: "center" }}>
        {formattedDate}
      </Typography>
      <IconButton size="small" onClick={handleNext} aria-label="Next day">
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default ArrowDatePicker;
