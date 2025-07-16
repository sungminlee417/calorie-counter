'use server'

import { LoginInput, SignupInput } from "@/types/auth";
import { createClient } from "@/utils/supabase/server";

export const fetchLogin = async (input: LoginInput) => {
  const supabase = await createClient();

  const { email, password } = input;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export const fetchLogout = async () => {
const supabase = await createClient();
  return await supabase.auth.signOut();
};

export const fetchSignup = async (input: SignupInput) => {
  const supabase = await createClient();

  const { email, password, first_name, last_name } = input;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name,
        last_name,
      },
      emailRedirectTo: process.env.SIGNUP_REDIRECT_LINK
    },
  });

  return { data, error };
};

export const fetchUser = async () => {
  const supabase = await createClient();
  return await supabase.auth.getUser();
}
