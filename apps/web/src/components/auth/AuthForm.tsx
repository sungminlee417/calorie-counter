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
} from "@mui/material";
import Link from "next/link";
import { fetchLogin, fetchSignup } from "@/lib/supabase/fetch-auth";
import {
  LoginInput,
  loginSchema,
  SignupInput,
  signupSchema,
} from "@/types/auth";
import z from "zod/v4";

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

  const [loginData, setLoginData] = useState<LoginInput>(EMPTY_LOGIN_DATA);
  const [signupData, setSignupData] = useState<SignupInput>(EMPTY_SIGNUP_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(externalError || null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    } catch (err) {
      setLoading(false);
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={3}
      sx={{
        maxWidth: 420,
        mx: "auto",
        mt: 10,
        p: 4,
        borderRadius: 3,
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="h4" textAlign="center" mb={3}>
        {isLogin ? "Welcome Back" : "Create Your Account"}
      </Typography>

      <Stack spacing={2}>
        {!isLogin && (
          <>
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
            />
          </>
        )}

        <TextField
          label="Email"
          type="email"
          value={isLogin ? loginData.email : signupData.email}
          required
          onChange={(e) =>
            isLogin
              ? setLoginData((prev) => ({ ...prev, email: e.target.value }))
              : setSignupData((prev) => ({ ...prev, email: e.target.value }))
          }
          disabled={loading}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={isLogin ? loginData.password : signupData.password}
          required
          onChange={(e) =>
            isLogin
              ? setLoginData((prev) => ({ ...prev, password: e.target.value }))
              : setSignupData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
          }
          disabled={loading}
          fullWidth
        />

        {error && <Alert severity="error">{error}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          sx={{ mt: 1 }}
        >
          {loading
            ? isLogin
              ? "Logging in..."
              : "Signing up..."
            : isLogin
            ? "Login"
            : "Sign Up"}
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" style={{ textDecoration: "underline" }}>
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" style={{ textDecoration: "underline" }}>
                Log in
              </Link>
            </>
          )}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default AuthForm;
