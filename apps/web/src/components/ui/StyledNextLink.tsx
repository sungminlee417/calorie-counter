import NextLink from "next/link";
import { Link } from "@mui/material";

interface StyledNextLinkProps {
  href: string;
  children: React.ReactNode;
  sx?: object;
}

const StyledNextLink: React.FC<StyledNextLinkProps> = ({
  href,
  children,
  sx,
}) => {
  return (
    <Link
      component={NextLink}
      href={href}
      sx={{
        color: "primary.main",
        fontWeight: 600,
        cursor: "pointer",
        textDecoration: "none",
        position: "relative",
        "&:hover": {
          color: "primary.dark",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: "100%",
          height: 2,
          bgcolor: "primary.main",
          bottom: 0,
          left: 0,
          borderRadius: 1,
          transformOrigin: "right",
          transform: "scaleX(0)",
          transition: "transform 0.3s ease",
        },
        "&:hover::after": {
          transformOrigin: "left",
          transform: "scaleX(1)",
        },
        "&:visited": {
          color: "primary.main",
        },
        ...sx,
      }}
    >
      {children}
    </Link>
  );
};

export default StyledNextLink;
