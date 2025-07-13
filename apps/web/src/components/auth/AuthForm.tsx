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

interface AuthFormProps {
  mode: "login" | "signup";
  error?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, error: externalError }) => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(externalError || null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isLogin = mode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (isLogin) {
      const { data, error } = await fetchLogin(email, password);
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
      const { data, error } = await fetchSignup(email, password, name);
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
          <TextField
            label="Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        )}

        <TextField
          label="Email"
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
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
