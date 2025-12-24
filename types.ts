
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
  | 'Promotional';

export type ProfessionalRole = 'Model' | 'Photographer' | 'Make-up Artist';

export interface ModelStats {
  bust?: number; 
  waist?: number; 
  hips?: number; 
  eyeColor?: string;
  hairColor?: string;
  shoeSize?: number; 
  dressSize?: string;
  hairTexture?: string;
  // Professional specific
  specialties?: string[];
  equipment?: string[];
  styles?: string[];
}

export interface Social {
  platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Twitch';
  handle: string;
  followers: number; 
}

export interface Model {
  id: string;
  name: string;
  role: ProfessionalRole;
  category?: Category;
  height?: number; 
  stats: ModelStats;
  imageUrl: string;
  price: number; 
  priceType: 'Fixed' | 'Negotiable' | 'Day Rate';
  unlockPrice: number; 
  
  // Demographics
  age: number;
  gender: string;
  ethnicity: string[];
  location: string;
  
  // Professional
  unionStatus?: 'SAG-AFTRA' | 'Equity' | 'Non-Union';
  tags: string[]; 
  socials?: Social[];
  skills?: string[];
  bio?: string;
}
