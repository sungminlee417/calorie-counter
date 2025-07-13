import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";


export async function redirectIfAuthenticated() {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }
}

export async function requireAuth() {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }
  return session
}
