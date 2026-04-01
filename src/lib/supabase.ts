import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'customer' | 'vendor' | 'admin';
  created_at: string;
  updated_at: string;
};

export type Vendor = {
  id: string;
  user_id: string;
  store_name: string;
  description: string;
  logo_url: string | null;
  status: 'pending' | 'active' | 'suspended';
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  parent_id: string | null;
  created_at: string;
};

export type Product = {
  id: string;
  vendor_id: string;
  category_id: string | null;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  images: string[];
  status: 'draft' | 'active' | 'inactive';
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  products?: Product;
};

export type Order = {
  id: string;
  customer_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: {
    full_name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    phone: string;
  };
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  vendor_id: string;
  quantity: number;
  price: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  products?: Product;
};

export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
};
