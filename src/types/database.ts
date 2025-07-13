export interface Database {
  public: {
    Tables: {
      brands: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          website_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string | null;
          website_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string | null;
          website_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      gyms: {
        Row: {
          id: string;
          brand_id: string;
          name: string;
          branch_name: string;
          instagram_url: string;
          instagram_handle: string;
          address: string | null;
          phone: string | null;
          latitude: number | null;
          longitude: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brand_id: string;
          name: string;
          branch_name: string;
          instagram_url: string;
          instagram_handle: string;
          address?: string | null;
          phone?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          brand_id?: string;
          name?: string;
          branch_name?: string;
          instagram_url?: string;
          instagram_handle?: string;
          address?: string | null;
          phone?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      route_updates: {
        Row: {
          id: string;
          gym_id: string;
          type: "newset" | "removal" | "partial_removal" | "announcement";
          update_date: string;
          title: string | null;
          description: string | null;
          instagram_post_url: string | null;
          instagram_post_id: string | null;
          image_urls: string[];
          raw_caption: string | null;
          parsed_data: any | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          type: "newset" | "removal" | "partial_removal" | "announcement";
          update_date: string;
          title?: string | null;
          description?: string | null;
          instagram_post_url?: string | null;
          instagram_post_id?: string | null;
          image_urls?: string[];
          raw_caption?: string | null;
          parsed_data?: any | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          type?: "newset" | "removal" | "partial_removal" | "announcement";
          update_date?: string;
          title?: string | null;
          description?: string | null;
          instagram_post_url?: string | null;
          instagram_post_id?: string | null;
          image_urls?: string[];
          raw_caption?: string | null;
          parsed_data?: any | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      crawl_logs: {
        Row: {
          id: string;
          gym_id: string;
          status: "success" | "failed" | "partial";
          posts_found: number;
          posts_new: number;
          error_message: string | null;
          started_at: string;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          status: "success" | "failed" | "partial";
          posts_found?: number;
          posts_new?: number;
          error_message?: string | null;
          started_at: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          status?: "success" | "failed" | "partial";
          posts_found?: number;
          posts_new?: number;
          error_message?: string | null;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

// src/types/index.ts

// export type Brand = Database["public"]["Tables"]["brands"]["Row"];
// export type Gym = Database["public"]["Tables"]["gyms"]["Row"] & {
//   brand?: Brand;
// };
// export type RouteUpdate =
//   Database["public"]["Tables"]["route_updates"]["Row"] & {
//     gym?: Gym;
//   };
// export type CrawlLog = Database["public"]["Tables"]["crawl_logs"]["Row"];

// export type UpdateType =
//   | "newset"
//   | "removal"
//   | "partial_removal"
//   | "announcement";

// export interface ParsedRouteData {
//   routes?: {
//     color?: string;
//     grade?: string;
//     count?: number;
//   }[];
//   removedRoutes?: string[];
//   specialNotes?: string[];
// }
