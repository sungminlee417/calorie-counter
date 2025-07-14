'use server'

import { createClient } from "@/utils/supabase/server";

export const fetchLogin = async (email: string, password: string) => {
  const supabase = await createClient();
  return await supabase.auth.signInWithPassword({email, password});
};

export const fetchLogout = async () => {
const supabase = await createClient();
  return await supabase.auth.signOut();
};

export const fetchSignup = async (email: string, password: string, name: string) => {
  const supabase = await createClient();

  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
};
