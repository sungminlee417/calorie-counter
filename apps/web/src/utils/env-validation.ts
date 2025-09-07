/**
 * Environment variable validation utilities
 */

interface EnvConfig {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  OPENAI_API_KEY?: string;
}

/**
 * Validates that required environment variables are present
 */
export const validateEnvironmentVariables = (): EnvConfig => {
  const requiredClientVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ] as const;

  // Skip validation entirely during SSR or initial hydration in development
  // This prevents errors when environment variables haven't loaded yet
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    // Give it a moment for Next.js to load env vars
    const allNextPublicVars = Object.keys(process.env).filter((k) =>
      k.startsWith("NEXT_PUBLIC_")
    );
    if (allNextPublicVars.length === 0) {
      throw new Error("Environment variables not yet loaded");
    }
  }

  const errors: string[] = [];

  // Check required client-side variables
  for (const varName of requiredClientVars) {
    const value = process.env[varName];
    if (!value || value.trim() === "") {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  }

  if (errors.length > 0) {
    const errorMessage = `Environment validation failed:\n${errors.join("\n")}\n\nPlease check your .env.local file or create one using .env.example as a template.\n\nAvailable env vars: ${Object.keys(
      process.env
    )
      .filter((key) => key.startsWith("NEXT_PUBLIC_"))
      .join(", ")}`;

    // In development, just warn but don't throw - let the fallback handle it
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️  Environment validation warning:", errorMessage);
      console.warn("⚠️  Continuing in development mode with fallback...");
      // Return empty object to trigger fallback logic
      throw new Error(errorMessage);
    } else {
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  };
};

/**
 * Validates URL format for Supabase URL
 */
export const validateSupabaseUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.includes("supabase");
  } catch {
    return false;
  }
};

/**
 * Validates Supabase anonymous key format (basic check)
 */
export const validateSupabaseAnonKey = (key: string): boolean => {
  // Supabase anon keys are JWT tokens, should be long strings
  return key.length > 100 && key.includes(".");
};

/**
 * Comprehensive environment validation with detailed checks
 */
export const validateEnvironmentWithChecks = (): EnvConfig => {
  const env = validateEnvironmentVariables();

  // Additional validation for Supabase URL
  if (!validateSupabaseUrl(env.NEXT_PUBLIC_SUPABASE_URL)) {
    throw new Error(
      "Invalid NEXT_PUBLIC_SUPABASE_URL format. Expected a valid Supabase URL."
    );
  }

  // Additional validation for Supabase anon key
  if (!validateSupabaseAnonKey(env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
    console.warn(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY format appears invalid. Please verify your Supabase configuration."
    );
  }

  return env;
};
