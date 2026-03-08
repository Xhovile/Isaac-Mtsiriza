export type University = 
  | "MUBAS" 
  | "LUANAR" 
  | "MZUNI" 
  | "UNIMA" 
  | "MUST" 
  | "Catholic University (CU)" 
  | "Livingstonia" 
  | "MAGU";

export type Category = 
  | "Food & Snacks" 
  | "Fashion & Clothing" 
  | "Academic Services" 
  | "Electronics & Gadgets" 
  | "Beauty & Personal Care";

export type ListingStatus = "available" | "sold";

export interface UserProfile {
  uid: string;
  email: string;
  is_seller: boolean;
  is_verified: boolean;
  join_date: string;

  // general user fields
  university?: University;

  // seller-only fields
  business_name?: string;
  business_logo?: string;
  bio?: string;
  whatsapp_number?: string;
}

export interface Listing {
  id: number;
  seller_uid: string;
  name: string;
  price: number;
  description: string;
  category: Category;
  university: University;
  photos: string[];
  video_url?: string | null;
  whatsapp_number: string;
  status: ListingStatus;
  created_at: string;
  // Joined fields
  business_name: string;
  business_logo: string;
  is_verified: boolean;
}
export interface RatingSummary {
  averageRating: number;
  ratingCount: number;
  myRating: number | null;
}
