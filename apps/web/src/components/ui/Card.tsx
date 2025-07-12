import React from "react";

import { Card as MuiCard, CardContent } from "@mui/material";

export interface CardProps {
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <MuiCard>
      <CardContent>{children}</CardContent>
    </MuiCard>
  );
};

export default Card;
