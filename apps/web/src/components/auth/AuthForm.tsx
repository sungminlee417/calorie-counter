"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Alert,
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
          if (
            error.message.includes("Email not confirmed") ||
            error.message.includes("invalid login credentials")
          ) {
            setError(
              "Login failed. Make sure you have confirmed your email and your credentials are correct."
            );
          } else {
            setError(error.message);
          }
          return;
        }

        router.push("/dashboard");
      } else {
        signupSchema.parse(signupData);

        const { error } = await fetchSignup(signupData);
        setLoading(false);

        if (error) {
          if (error.message.includes("User already registered")) {
            setError(
              "This email is already registered. Please log in or reset your password."
            );
          } else {
            setError(error.message);
          }
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
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 4,
        border: "1px solid #ddd",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography variant="h5" mb={2}>
        {isLogin ? "Login" : "Sign Up"}
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
        />

        {error && <Alert severity="error">{error}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <Button
          type="submit"
          variant="contained"
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
              Don&apos;t have an account? <Link href="/signup">Sign up</Link>
            </>
          ) : (
            <>
              Already have an account? <Link href="/login">Login</Link>
            </>
          )}
        </Typography>
      </Stack>
    </Box>
  );
};

export default AuthForm;
