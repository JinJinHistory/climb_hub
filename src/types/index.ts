export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Gym {
  id: string;
  brandId: string;
  name: string;
  branchName: string;
  instagramUrl: string;
  instagramHandle: string;
  address?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  brand?: Brand;
}

export interface RouteUpdate {
  id: string;
  gymId: string;
  type: "NEWSET" | "REMOVAL" | "ANNOUNCEMENT";
  updateDate: string;
  title?: string;
  description?: string;
  instagramPostUrl?: string;
  instagramPostId?: string;
  imageUrls: string[];
  rawCaption?: string;
  parsedData?: any;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  gym?: Gym;
}

export interface CrawlLog {
  id: string;
  gymId: string;
  status: "success" | "failed" | "partial";
  postsFound: number;
  postsNew: number;
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  gym?: Gym;
}

export type UpdateType = "NEWSET" | "REMOVAL" | "ANNOUNCEMENT";
export type CrawlStatus = "success" | "failed" | "partial";

export interface ParsedRouteData {
  routes?: {
    color?: string;
    grade?: string;
    count?: number;
  }[];
  removedRoutes?: string[];
  specialNotes?: string[];
}
