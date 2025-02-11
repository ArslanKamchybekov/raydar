import { Brands, Categories, Colors, Locations, Materials, Size, Weather } from "./enums";

export enum Threshold {
    LOW = 0.3,
    MEDIUM = 0.5,
    HIGH = 0.7,
}

export interface User {
    id: string;
    user_id: string;
    first_name: string | null;
    last_name: string | null;
    emailAddress: string | null;
    profile_image_url: string;
    subscription: string;
}

export interface ClerkUser {
    id: string;
    firstName: string | null;
    lastName: string | null;
    emailAddress: string | null;
    profileImageUrl: string;
}

export interface Alert {
    id: string;
    userid: string;
    category: keyof typeof Categories;
    location: keyof typeof Locations;
    brand: keyof typeof Brands | null;
    color: keyof typeof Colors | null;
    size: keyof typeof Size | null;
    material: keyof typeof Materials | null;
    weather: keyof typeof Weather | null;
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
};

export interface Item {
    id: string;
    user_id: string; // user_id of the person who uploaded the item
    title: string;
    description: string;
    image_url: string;
    claimed: boolean;
    keywords: string[];
    category: string;
    location_name: string;
    brand: string | null;
    colors: string[];
    size: string | null;
    material: string | null;
    weather_found: string | null;
    created_at: string;
};