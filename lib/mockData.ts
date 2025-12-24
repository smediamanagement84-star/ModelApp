
import { Model, Category } from '../types';

export const MODELS: Model[] = [
  {
    id: '1',
    name: 'Elena V.',
    role: 'Model',
    category: 'Women',
    height: 178,
    stats: { bust: 85, waist: 60, hips: 90, eyeColor: 'Blue', hairColor: 'Dark Brown', shoeSize: 39, dressSize: 'S', hairTexture: 'Straight' },
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
    price: 35000,
    priceType: 'Negotiable',
    unlockPrice: 4900,
    age: 24,
    gender: 'Female',
    ethnicity: ['White', 'Latinx'],
    location: 'New York',
    tags: ['High Fashion', 'Editorial'],
    unionStatus: 'Non-Union',
    socials: [{ platform: 'Instagram', handle: '@elena_v', followers: 15000 }]
  },
  {
    id: 'p1',
    name: 'Viktor Reznov',
    role: 'Photographer',
    stats: { styles: ['Editorial', 'Commercial', 'Film'], equipment: ['Sony A7R V', 'Leica M11'] },
    imageUrl: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=1887&auto=format&fit=crop',
    price: 85000,
    priceType: 'Day Rate',
    unlockPrice: 2500,
    age: 32,
    gender: 'Male',
    ethnicity: ['White'],
    location: 'Paris',
    tags: ['Cinema', 'High Contrast'],
    socials: [{ platform: 'Instagram', handle: '@viktor_v', followers: 42000 }]
  },
  {
    id: 'm1',
    name: 'Anya Taylor',
    role: 'Make-up Artist',
    stats: { specialties: ['High Fashion', 'SFX', 'Bridal'] },
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop',
    price: 25000,
    priceType: 'Fixed',
    unlockPrice: 1500,
    age: 27,
    gender: 'Female',
    ethnicity: ['White'],
    location: 'London',
    tags: ['Minimalist', 'Glow'],
    socials: [{ platform: 'Instagram', handle: '@anya_mua', followers: 12000 }]
  },
  {
    id: '2',
    name: 'Marcus T.',
    role: 'Model',
    category: 'Men',
    height: 188,
    stats: { bust: 100, waist: 82, hips: 98, eyeColor: 'Brown', hairColor: 'Black', shoeSize: 44, dressSize: 'L', hairTexture: 'Coily' },
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop',
    price: 40000,
    priceType: 'Fixed',
    unlockPrice: 3900,
    age: 28,
    gender: 'Male',
    ethnicity: ['Black'],
    location: 'Los Angeles',
    tags: ['Athletic', 'Streetwear'],
    unionStatus: 'SAG-AFTRA',
    socials: [{ platform: 'Instagram', handle: '@marcus_fit', followers: 45000 }]
  }
];

export const CATEGORIES: string[] = [
  'Women', 'Men', 'New Faces', 'Plus Size', 'Runway',
  'Editorial', 'Commercial', 'Petite', 'Alternative',
  'Best Agers', 'Fitness', 'Influencers', 'Promotional'
];

export const EYE_COLORS = ['Blue', 'Brown', 'Green', 'Hazel', 'Grey'];
export const HAIR_COLORS = ['Black', 'Dark Brown', 'Brown', 'Brunette', 'Blonde', 'Red', 'Grey', 'Silver'];
export const SHOE_SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

export const GENDERS = ['Male', 'Female', 'Non-Binary', 'Trans Male', 'Trans Female', 'Gender Fluid', 'Agender'];
export const ETHNICITIES = ['White', 'Black', 'East Asian', 'South Asian', 'Latinx', 'Middle Eastern', 'Multiracial', 'Indigenous'];
export const LOCATIONS = ['New York', 'Los Angeles', 'Miami', 'Chicago', 'London', 'Paris', 'Milan', 'Berlin', 'Tokyo', 'Seoul', 'Sydney'];
export const DRESS_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
export const VIBES = ['High Fashion', 'Editorial', 'Commercial', 'Athletic', 'Streetwear', 'Girl Next Door', 'Corporate', 'Edgy', 'Alternative', 'Wholesome'];
export const HAIR_TEXTURES = ['Straight', 'Wavy', 'Curly', 'Coily', 'Braids', 'Locs', 'Bald'];
export const PHOTO_STYLES = ['Editorial', 'Commercial', 'Film', 'Digital', 'Street', 'Landscape', 'E-commerce'];
export const MUA_SPECIALTIES = ['Editorial', 'High Fashion', 'SFX', 'Bridal', 'Natural', 'Glamour', 'Body Paint'];
