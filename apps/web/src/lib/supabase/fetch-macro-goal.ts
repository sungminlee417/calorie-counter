import { MacroGoal } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const fetchGetMacroGoal = async (): Promise<MacroGoal | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found. Please make sure you are logged in.");
  }

  const { data, error } = await supabase
    .from("macro_goals")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data ?? [];
};

export const fetchCreateMacroGoal = async (
  macroGoal: Omit<MacroGoal, "id" | "created_at" | "updated_at">
): Promise<MacroGoal> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found. Please make sure you are logged in.");
  }

  const userId = user.id;

  const { data, error } = await supabase
    .from("macro_goals")
    .insert({ ...macroGoal, user_id: userId })
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
  const { id } = macroGoal;

  // First, fetch the current macro goal to compare changes
  const { data: currentMacroGoal, error: fetchError } = await supabase
    .from("macro_goals")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) {
    throw new Error(
      `Failed to fetch current macro goal: ${fetchError.message}`
    );
  }

  if (!currentMacroGoal) {
    throw new Error("Macro goal not found");
  }

  // Check for changes using our change detection utility
  const { checkMacroGoalChanges } = await import("@/utils/change-detection");
  const changeResult = checkMacroGoalChanges(currentMacroGoal, macroGoal);

  // If no changes detected, return the current macro goal without updating
  if (!changeResult.hasChanges) {
    console.log("No changes detected for macro goal, skipping database update");
    return currentMacroGoal;
  }

  console.log(`Updating macro goal: ${changeResult.message}`);

  // Only update the fields that have actually changed
  const { data, error } = await supabase
    .from("macro_goals")
    .update(changeResult.changedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const fetchDeleteMacroGoal = async (
  macroGoalId: number
): Promise<{ message: string }> => {
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
