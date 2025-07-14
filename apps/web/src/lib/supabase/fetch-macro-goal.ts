import {  MacroGoal } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const fetchGetMacroGoal = async (): Promise<MacroGoal> => {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not found. Please make sure you are logged in.");
  }

  const { data, error } = await supabase.from("macro_goals").select("*").eq('user_id', user.id).single();

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const fetchCreateMacroGoal = async (
  macroGoal: Omit<MacroGoal, "id" | "created_at" | "updated_at">
): Promise<MacroGoal> => {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not found. Please make sure you are logged in.");
  }

  const userId = user.id

  const { data, error } = await supabase
    .from("macro_goals")
    .insert({...macroGoal, user_id: userId})
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const fetchUpdateMacroGoal = async (
  macroGoal: Partial<MacroGoal> & { id: number }
): Promise<MacroGoal> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, created_at, updated_at, ...updateData } = macroGoal;

  const { data, error } = await supabase
    .from("macro_goals")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const fetchDeleteMacroGoal = async (macroGoalId: number): Promise<{ message: string }> => {
  if (!macroGoalId) {
    throw new Error("Macro goal ID is required");
  }

  const { error } = await supabase
    .from("macro_goals")
    .delete()
    .eq("id", macroGoalId);

  if (error) {
    throw new Error(error.message);
  }

  return { message: "Macro goal deleted successfully" };
};
