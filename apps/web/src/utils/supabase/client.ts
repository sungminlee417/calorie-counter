import { createBrowserClient } from "@supabase/ssr";
import { validateEnvironmentWithChecks } from "@/utils/env-validation";

export function createClient() {
  // Get environment variables directly
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // In development, be more lenient about missing env vars
  if (process.env.NODE_ENV === "development") {
    if (!supabaseUrl || !supabaseKey) {
      console.warn(
        "⚠️  Missing Supabase environment variables. Please check your .env.local file."
      );
      console.warn("Required variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY");
      
      // Return a mock client that will fail gracefully
      return createBrowserClient(
        supabaseUrl || "https://placeholder.supabase.co",
        supabaseKey || "placeholder-key"
      );
    }
  }

  // Production validation
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing required Supabase environment variables. Please check your .env.local file."
    );
  }

  // Optional: Run validation for additional checks in production
  if (process.env.NODE_ENV === "production") {
    try {
      validateEnvironmentWithChecks();
    } catch (error) {
      console.warn("Environment validation warning:", error);
    }
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
