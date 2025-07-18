import React from "react";

import { Card as MuiCard, CardContent } from "@mui/material";

export interface CardProps {
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <MuiCard
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.3s",
        "&:hover": {
          boxShadow: 4,
        },
      }}
    >
      <CardContent>{children}</CardContent>
    </MuiCard>
  );
};

export default Card;
