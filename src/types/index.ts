import { Database } from "@/types/database";

// export interface Brand {
//   id: string;
//   name: string;
//   logo_url?: string;
//   website_url?: string;
// }

// export interface Gym {
//   id: string;
//   brand_id: string;
//   name: string;
//   branch_name: string;
//   instagram_url: string;
//   instagram_handle: string;
//   is_active: boolean;
//   brand?: Brand;
// }

// export interface RouteUpdate {
//   id: string;
//   gym_id: string;
//   type: "newset" | "removal" | "partial_removal" | "announcement";
//   update_date: string;
//   title?: string;
//   description?: string;
//   instagram_post_url?: string;
//   raw_caption?: string;
//   created_at: string;
//   gym?: Gym;
// }

export type Brand = Database["public"]["Tables"]["brands"]["Row"];
export type Gym = Database["public"]["Tables"]["gyms"]["Row"] & {
  brand?: Brand;
};
export type RouteUpdate =
  Database["public"]["Tables"]["route_updates"]["Row"] & {
    gym?: Gym;
  };
export type CrawlLog = Database["public"]["Tables"]["crawl_logs"]["Row"];

export type UpdateType =
  | "newset"
  | "removal"
  | "partial_removal"
  | "announcement";

export interface ParsedRouteData {
  routes?: {
    color?: string;
    grade?: string;
    count?: number;
  }[];
  removedRoutes?: string[];
  specialNotes?: string[];
}
