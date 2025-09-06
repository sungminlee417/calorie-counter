"use client";

import React from "react";
import { Chip, Tooltip, useTheme } from "@mui/material";
import { Storage, Public, LocalFireDepartment } from "@mui/icons-material";

import { FoodSourceType } from "@/types/food-provider";
import { MACRO_CHART_COLORS } from "@/constants/app";

interface FoodSourceBadgeProps {
  source: FoodSourceType;
  variant?: "filled" | "outlined";
  size?: "small" | "medium";
  showIcon?: boolean;
  showTooltip?: boolean;
}

const FoodSourceBadge: React.FC<FoodSourceBadgeProps> = ({
  source,
  variant = "filled",
  size = "small",
  showIcon = true,
  showTooltip = true,
}) => {
  const theme = useTheme();

  const getSourceConfig = (sourceType: FoodSourceType) => {
    switch (sourceType) {
      case FoodSourceType.INTERNAL:
        return {
          label: "Personal",
          icon: <Storage sx={{ fontSize: 14 }} />,
          color: MACRO_CHART_COLORS.protein,
          tooltip: "From your personal food database",
          description: "Custom food item you've added",
        };

      case FoodSourceType.FDC_USDA:
        return {
          label: "USDA",
          icon: <Public sx={{ fontSize: 14 }} />,
          color: MACRO_CHART_COLORS.fat,
          tooltip: "USDA Food Data Central",
          description: "Official nutrition data from USDA",
        };

      default:
        return {
          label: "Unknown",
          icon: <LocalFireDepartment sx={{ fontSize: 14 }} />,
          color: theme.palette.grey[500],
          tooltip: "Unknown food source",
          description: "Food source not recognized",
        };
    }
  };

  const config = getSourceConfig(source);

  const chipElement = (
    <Chip
      label={config.label}
      icon={showIcon ? config.icon : undefined}
      variant={variant}
      size={size}
      sx={{
        backgroundColor:
          variant === "filled" ? `${config.color}15` : "transparent",
        borderColor: `${config.color}66`,
        color: config.color,
        fontWeight: "600",
        fontSize: size === "small" ? "0.7rem" : "0.75rem",
        height: size === "small" ? 20 : 24,
        "& .MuiChip-icon": {
          color: config.color,
        },
        "& .MuiChip-label": {
          paddingLeft: showIcon ? 0 : 1,
          paddingRight: 1,
        },
        "&:hover": {
          backgroundColor:
            variant === "filled" ? `${config.color}25` : `${config.color}08`,
          borderColor: `${config.color}88`,
        },
        transition: "all 0.2s ease-in-out",
      }}
    />
  );

  if (showTooltip) {
    return (
      <Tooltip
        title={
          <div>
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>
              {config.tooltip}
            </div>
            <div style={{ fontSize: "0.85em", opacity: 0.9 }}>
              {config.description}
            </div>
          </div>
        }
        arrow
        placement="top"
      >
        {chipElement}
      </Tooltip>
    );
  }

  return chipElement;
};

export default FoodSourceBadge;
