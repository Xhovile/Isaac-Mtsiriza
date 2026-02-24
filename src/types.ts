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

export interface Seller {
  id: number;
  email_phone: string;
  business_name: string;
  business_logo: string;
  university: University;
  bio?: string;
  is_verified: boolean;
  created_at: string;
}

export interface Listing {
  id: number;
  seller_id: number;
  name: string;
  price: number;
  description: string;
  category: Category;
  university: University;
  photos: string[];
  whatsapp_number: string;
  created_at: string;
  // Joined fields
  business_name: string;
  business_logo: string;
  is_verified: boolean;
}
