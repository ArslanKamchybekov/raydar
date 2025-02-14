export enum Threshold {
  LOW = 0.3,
  MEDIUM = 0.5,
  HIGH = 0.7,
}

export enum Size {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
}

export enum ClaimStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum ReportStatus {
  PENDING = "pending",
  RESOLVED = "resolved",
  DISMISSED = "dismissed",
}

export interface User {
  id: string;
  user_id: string;
  full_name: string | null;
  emailAddress: string;
  image: string;
  role: string;
}

export interface Alert {
  id: string;
  user_id: string;
  category: string;
  location: string;
  colors: string[] | null;
  brand: string | null;
  material: string | null;
  weather: string | null;
  size: string | null;
  enabled: boolean;
}

export interface RelevantItem {
  id: string;
  image_id: string;
  brand: string;
  category: string;
  colors: string[];
  created_at: string;
  description: string;
  keywords: string[];
  location_name: string;
  material: string;
  similarity_score: number;
  size: string;
  user_id: string;
  weather_found: string;
}

export interface Item {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image: string | null;
  claimed: boolean;
  keywords: string[];
  category: string;
  location: string;
  brand: string | null;
  colors: string[];
  size: string | null;
  material: string | null;
  weather: string | null;
  created_at: Date;
}

export interface Claim {
  id: string;
  user_id: string;
  item_id: string;
  reason: string;
  image: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: Date;
}

export interface Report {
  id: string;
  user_id: string;
  item_id: string;
  reason: string;
  status: ReportStatus;
  notes: string | null;
  created_at: Date;
}
