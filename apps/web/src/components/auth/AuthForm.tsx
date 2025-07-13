"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Alert,
} from "@mui/material";
import Link from "next/link";
import { fetchLogin } from "@/app/api/client/fetch-auth";

interface AuthFormProps {
  mode: "login" | "signup";
  error?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const isLogin = mode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    isLogin ? await fetchLogin(email, password) : undefined;
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
          />
        )}

        <TextField
          label="Email"
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <Alert severity="error">{error}</Alert>}

        <Button type="submit" variant="contained">
          {isLogin ? "Login" : "Sign Up"}
        </Button>

        <Typography variant="body2" align="center">
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
