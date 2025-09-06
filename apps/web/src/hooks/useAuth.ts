"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface UseAuthOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

export function useAuth(options: UseAuthOptions = {}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);

      // Redirect if required and no user
      if (options.requireAuth && !user && options.redirectTo) {
        router.push(options.redirectTo);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);

      if (options.requireAuth && !session?.user && options.redirectTo) {
        router.push(options.redirectTo);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router, options.requireAuth, options.redirectTo]);

  return { user, loading, isAuthenticated: !!user };
}
