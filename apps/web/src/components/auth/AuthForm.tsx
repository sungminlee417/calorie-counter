"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  TextField,
  Typography,
  Stack,
  Alert,
  Paper,
  Box,
  useTheme,
  Fade,
  IconButton,
} from "@mui/material";
import {
  LocalFireDepartment,
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import z from "zod/v4";

import { fetchLogin, fetchSignup } from "@/lib/supabase/fetch-auth";
import {
  LoginInput,
  loginSchema,
  SignupInput,
  signupSchema,
} from "@/types/auth";
import { MACRO_CHART_COLORS, UI_COLORS } from "@/constants/app";
import StyledNextLink from "../ui/StyledNextLink";

interface AuthFormProps {
  mode: "login" | "signup";
  error?: string;
}

const EMPTY_LOGIN_DATA: LoginInput = {
  email: "",
  password: "",
};

const EMPTY_SIGNUP_DATA: SignupInput = {
  email: "",
  password: "",
  first_name: "",
  last_name: "",
};

const AuthForm: React.FC<AuthFormProps> = ({ mode, error: externalError }) => {
  const router = useRouter();
  const theme = useTheme();

  const [loginData, setLoginData] = useState<LoginInput>(EMPTY_LOGIN_DATA);
  const [signupData, setSignupData] = useState<SignupInput>(EMPTY_SIGNUP_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(externalError || null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isLogin) {
        loginSchema.parse(loginData);
        const { error } = await fetchLogin(loginData);
        setLoading(false);

        if (error) {
          setError(
            error.message.includes("Email not confirmed") ||
              error.message.includes("invalid login credentials")
              ? "Login failed. Make sure you have confirmed your email and your credentials are correct."
              : error.message
          );
          return;
        }

        router.push("/dashboard");
      } else {
        signupSchema.parse(signupData);
        const { error } = await fetchSignup(signupData);
        setLoading(false);

        if (error) {
          setError(
            error.message.includes("User already registered")
              ? "This email is already registered. Please log in or reset your password."
              : error.message
          );
          return;
        }

        setSuccessMessage(
          "Signup successful! Please check your email and confirm your address before logging in."
        );
      }
    } catch (e) {
      setLoading(false);
      if (e instanceof z.ZodError) {
        setError(e.issues[0].message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
            : "linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)",
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
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh", padding: 2 }}
      >
        <Fade in timeout={600}>
          <Paper
            component="form"
            onSubmit={handleSubmit}
            elevation={2}
            sx={{
              maxWidth: 440,
              width: "100%",
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {/* Header with icon */}
            <Stack alignItems="center" spacing={2} mb={4}>
              <LocalFireDepartment
                sx={{
                  color: MACRO_CHART_COLORS.calories,
                  fontSize: 40,
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                }}
              />
              <Typography
                variant="h4"
                textAlign="center"
                sx={{
                  fontWeight: "600",
                  background: `linear-gradient(45deg, ${MACRO_CHART_COLORS.calories}, ${MACRO_CHART_COLORS.carbs})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {isLogin ? "Welcome Back" : "Join Calorie Counter"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                {isLogin
                  ? "Sign in to continue tracking your nutrition journey"
                  : "Start your nutrition tracking journey today"}
              </Typography>
            </Stack>

            <Stack spacing={3}>
              {!isLogin && (
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="First Name"
                    value={signupData.first_name}
                    required
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                    disabled={loading}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <Person sx={{ color: "text.secondary", mr: 1 }} />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: MACRO_CHART_COLORS.calories,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: MACRO_CHART_COLORS.calories,
                        },
                      },
                    }}
                  />
                  <TextField
                    label="Last Name"
                    value={signupData.last_name}
                    required
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        last_name: e.target.value,
                      }))
                    }
                    disabled={loading}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <Person sx={{ color: "text.secondary", mr: 1 }} />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: MACRO_CHART_COLORS.calories,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: MACRO_CHART_COLORS.calories,
                        },
                      },
                    }}
                  />
                </Stack>
              )}

              <TextField
                label="Email"
                type="email"
                value={isLogin ? loginData.email : signupData.email}
                required
                onChange={(e) =>
                  isLogin
                    ? setLoginData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    : setSignupData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                }
                disabled={loading}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <Email sx={{ color: "text.secondary", mr: 1 }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: MACRO_CHART_COLORS.calories,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: MACRO_CHART_COLORS.calories,
                    },
                  },
                }}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={isLogin ? loginData.password : signupData.password}
                required
                onChange={(e) =>
                  isLogin
                    ? setLoginData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    : setSignupData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                }
                disabled={loading}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <Lock sx={{ color: "text.secondary", mr: 1 }} />
                  ),
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: MACRO_CHART_COLORS.calories,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: MACRO_CHART_COLORS.calories,
                    },
                  },
                }}
              />

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    borderRadius: 2,
                    "& .MuiAlert-icon": {
                      color: MACRO_CHART_COLORS.calories,
                    },
                  }}
                >
                  {error}
                </Alert>
              )}
              {successMessage && (
                <Alert
                  severity="success"
                  sx={{
                    borderRadius: 2,
                    "& .MuiAlert-icon": {
                      color: MACRO_CHART_COLORS.fat,
                    },
                  }}
                >
                  {successMessage}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={isLogin ? <Email /> : <Person />}
                sx={{
                  mt: 1,
                  py: 1.5,
                  background: `linear-gradient(45deg, ${MACRO_CHART_COLORS.calories}, ${MACRO_CHART_COLORS.carbs})`,
                  boxShadow: UI_COLORS.shadows.medium,
                  fontWeight: "600",
                  textTransform: "none",
                  borderRadius: 2,
                  "&:hover": {
                    background: `linear-gradient(45deg, ${MACRO_CHART_COLORS.carbs}, ${MACRO_CHART_COLORS.protein})`,
                    boxShadow: UI_COLORS.shadows.strong,
                    transform: "translateY(-1px)",
                  },
                  "&:disabled": {
                    background: theme.palette.action.disabledBackground,
                    transform: "none",
                  },
                  transition: "all 0.3s ease-in-out",
                }}
              >
                {loading
                  ? isLogin
                    ? "Signing in..."
                    : "Creating account..."
                  : isLogin
                    ? "Sign In"
                    : "Create Account"}
              </Button>

              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                {isLogin ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <StyledNextLink
                      href="/signup"
                      sx={{
                        color: MACRO_CHART_COLORS.calories,
                        textDecoration: "none",
                        fontWeight: "600",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Create one here
                    </StyledNextLink>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <StyledNextLink
                      href="/login"
                      sx={{
                        color: MACRO_CHART_COLORS.calories,
                        textDecoration: "none",
                        fontWeight: "600",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Sign in here
                    </StyledNextLink>
                  </>
                )}
              </Typography>
            </Stack>
          </Paper>
        </Fade>
      </Stack>
    </Box>
  );
};

export default AuthForm;
