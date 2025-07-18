import React from "react";

import { Card as MuiCard, CardContent, SxProps } from "@mui/material";

export interface CardProps {
  children?: React.ReactNode;
  sx?: SxProps;
}

const Card: React.FC<CardProps> = ({ children, sx }) => {
  return (
    <MuiCard sx={{ ...sx }}>
      <CardContent>{children}</CardContent>
    </MuiCard>
  );
};

export default Card;
