import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  fetchCreateMacroGoal,
  fetchDeleteMacroGoal,
  fetchGetMacroGoal,
  fetchUpdateMacroGoal,
} from "@/lib/supabase/fetch-macro-goal";
import { MacroGoal } from "@/types/supabase";

const useMacroGoal = () => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["macro_goals"],
    queryFn: fetchGetMacroGoal,
  });

  const createMacroGoal = useMutation({
    mutationFn: (
      newMacroGoal: Omit<MacroGoal, "id" | "created_at" | "updated_at">
    ) => fetchCreateMacroGoal(newMacroGoal),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["macro_goals"] }),
  });

  const updateMacroGoal = useMutation({
    mutationFn: (updatedMacroGoal: MacroGoal) =>
      fetchUpdateMacroGoal(updatedMacroGoal),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["macro_goals"] }),
  });

  const deleteMacroGoal = useMutation({
    mutationFn: (foodId: string) => fetchDeleteMacroGoal(Number(foodId)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["macro_goals"] }),
  });

  return {
    macroGoal: data,
    error,
    isLoading,
    createMacroGoal,
    updateMacroGoal,
    deleteMacroGoal,
  };
};

export default useMacroGoal;
