
export type Category = 
  | 'Women' 
  | 'Men' 
  | 'New Faces' 
  | 'Plus Size' 
  | 'Runway'
  | 'Editorial'
  | 'Commercial'
  | 'Petite'
  | 'Alternative'
  | 'Best Agers' 
  | 'Fitness' 
  | 'Influencers' 
  | 'Promotional'
  | 'NSFW';

export interface ModelStats {
  bust: number; // cm
  waist: number; // cm
  hips: number; // cm
  eyeColor: string;
  hairColor: string;
  shoeSize: number; // EU
  dressSize?: string;
  hairTexture?: string;
}

export interface Social {
  platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Twitch';
  handle: string;
  followers: number; // Count
}

export interface Model {
  id: string;
  name: string;
  category: Category;
  height: number; // cm
  stats: ModelStats;
  imageUrl: string;
  price: number; // Hourly rate in USD
  priceType: 'Fixed' | 'Negotiable';
  unlockPrice: number; // Fee to view profile
  
  // Demographics
  age: number;
  gender: string;
  ethnicity: string[];
  location: string;
  
  // Professional
  unionStatus?: 'SAG-AFTRA' | 'Equity' | 'Non-Union';
  tags: string[]; // Vibes
  socials?: Social[];
  skills?: string[];
  
  // Inclusivity
  disabilities?: string[];
  visibleFeatures?: string[];
}