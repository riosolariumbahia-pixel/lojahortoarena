// Supabase Database Types
// Auto-generated types for type safety

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
          slug: string;
          domain: string | null;
          logo_url: string | null;
          primary_color: string;
          plan: 'starter' | 'growth' | 'pro' | 'enterprise';
          status: 'trial' | 'active' | 'suspended' | 'cancelled';
          trial_ends_at: string | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          max_customers: number;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tenants']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['tenants']['Insert']>;
      };
      profiles: {
        Row: {
          id: string;
          tenant_id: string | null;
          role: 'admin' | 'lojista' | 'funcionario' | 'cliente';
          name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          birthday: string | null;
          preferences: Json;
          xp: number;
          level: number;
          coins: number;
          streak: number;
          last_login: string | null;
          total_logins: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          slug: string;
          icon: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          tenant_id: string;
          category_id: string | null;
          name: string;
          description: string | null;
          price: number;
          compare_price: number | null;
          stock: number;
          sku: string | null;
          images: string[];
          tags: string[];
          is_active: boolean;
          rating: number;
          rating_count: number;
          species: string | null;
          care_difficulty: 'easy' | 'medium' | 'hard' | null;
          light_requirement: string | null;
          water_frequency: string | null;
          ai_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      customers: {
        Row: {
          id: string;
          tenant_id: string;
          profile_id: string | null;
          name: string;
          email: string | null;
          phone: string | null;
          birthday: string | null;
          address: Json | null;
          notes: string | null;
          segment: string;
          engagement_level: 'high' | 'medium' | 'low';
          total_spent: number;
          total_orders: number;
          last_visit: string | null;
          tags: string[];
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['customers']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          tenant_id: string;
          customer_id: string | null;
          status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
          subtotal: number;
          discount: number;
          total: number;
          payment_method: string | null;
          payment_status: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          total: number;
        };
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>;
      };
      user_plants: {
        Row: {
          id: string;
          profile_id: string;
          tenant_id: string;
          name: string;
          species: string | null;
          image_url: string | null;
          health_score: number;
          growth_percentage: number;
          water_frequency_days: number;
          last_watered: string | null;
          next_water: string | null;
          last_fertilized: string | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_plants']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_plants']['Insert']>;
      };
      plant_diary_entries: {
        Row: {
          id: string;
          plant_id: string;
          profile_id: string;
          entry_type: 'photo' | 'water' | 'fertilize' | 'prune' | 'growth' | 'note' | 'disease';
          content: string | null;
          image_url: string | null;
          ai_analysis: Json | null;
          xp_gained: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['plant_diary_entries']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['plant_diary_entries']['Insert']>;
      };
      achievements: {
        Row: {
          id: string;
          tenant_id: string | null;
          title: string;
          description: string;
          icon: string;
          xp_reward: number;
          coin_reward: number;
          max_progress: number;
          requirement_type: string;
          requirement_value: number;
          is_global: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['achievements']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['achievements']['Insert']>;
      };
      user_achievements: {
        Row: {
          id: string;
          profile_id: string;
          achievement_id: string;
          progress: number;
          unlocked: boolean;
          unlocked_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['user_achievements']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['user_achievements']['Insert']>;
      };
      missions: {
        Row: {
          id: string;
          tenant_id: string | null;
          title: string;
          description: string;
          icon: string;
          mission_type: 'daily' | 'weekly' | 'special';
          xp_reward: number;
          coin_reward: number;
          max_progress: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['missions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['missions']['Insert']>;
      };
      user_missions: {
        Row: {
          id: string;
          profile_id: string;
          mission_id: string;
          progress: number;
          completed: boolean;
          completed_at: string | null;
          assigned_date: string;
        };
        Insert: Omit<Database['public']['Tables']['user_missions']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['user_missions']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          profile_id: string;
          title: string;
          message: string;
          notification_type: 'water' | 'growth' | 'reward' | 'promo' | 'achievement' | 'system';
          icon: string | null;
          is_read: boolean;
          data: Json | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
      ai_scans: {
        Row: {
          id: string;
          profile_id: string;
          tenant_id: string;
          image_url: string;
          result: Json;
          plant_identified: string | null;
          confidence: number | null;
          diseases_detected: string[] | null;
          recommendations: string[] | null;
          xp_gained: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ai_scans']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['ai_scans']['Insert']>;
      };
      ai_chat_history: {
        Row: {
          id: string;
          profile_id: string;
          tenant_id: string;
          role: 'user' | 'assistant';
          content: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ai_chat_history']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['ai_chat_history']['Insert']>;
      };
      whatsapp_templates: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          message: string;
          variables: string[];
          sends: number;
          opens: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['whatsapp_templates']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['whatsapp_templates']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      add_xp: {
        Args: { user_id: string; amount: number };
        Returns: Json;
      };
      update_streak: {
        Args: { user_id: string };
        Returns: number;
      };
    };
    Enums: Record<string, never>;
  };
}

// Utility types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Common types
export type Tenant = Tables<'tenants'>;
export type Profile = Tables<'profiles'>;
export type Product = Tables<'products'>;
export type Customer = Tables<'customers'>;
export type Order = Tables<'orders'>;
export type UserPlant = Tables<'user_plants'>;
export type PlantDiaryEntry = Tables<'plant_diary_entries'>;
export type Achievement = Tables<'achievements'>;
export type Mission = Tables<'missions'>;
export type Notification = Tables<'notifications'>;
