import type { Database } from "../../supabase/types/supabase"

export type FoodEntry = Database['public']['Tables']['food_entries']['Row']
export type Food = Database['public']['Tables']['foods']['Row']
