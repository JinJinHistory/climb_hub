import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions
export const gymService = {
  async getAllGyms() {
    const { data, error } = await supabase
      .from("gyms")
      .select(`*, brand:brands(*)`)
      .eq("is_active", true)
      .order("name");

    if (error) throw error;
    return data;
  },

  async getLatestUpdates(gymId?: string, limit = 10) {
    let query = supabase
      .from("route_updates")
      .select(`*, gym:gyms(*, brand:brands(*))`)
      .order("update_date", { ascending: false })
      .limit(limit);

    if (gymId) {
      query = query.eq("gym_id", gymId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
};

export interface Brand {
  id: string;
  name: string;
  logo_url?: string;
  website_url?: string;
}

export interface Gym {
  id: string;
  brand_id: string;
  name: string;
  branch_name: string;
  instagram_url: string;
  instagram_handle: string;
  is_active: boolean;
  brand?: Brand;
}

export interface RouteUpdate {
  id: string;
  gym_id: string;
  type: "newset" | "removal" | "partial_removal" | "announcement";
  update_date: string;
  title?: string;
  description?: string;
  instagram_post_url?: string;
  raw_caption?: string;
  created_at: string;
  gym?: Gym;
}
