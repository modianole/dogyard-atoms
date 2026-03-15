export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      deals: {
        Row: {
          created_at: string
          deal_price: number
          description: string | null
          description_en: string | null
          ends_at: string | null
          id: string
          is_active: boolean | null
          items: string[] | null
          original_price: number
          restaurant_id: string
          starts_at: string | null
          title: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deal_price: number
          description?: string | null
          description_en?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          items?: string[] | null
          original_price: number
          restaurant_id: string
          starts_at?: string | null
          title: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deal_price?: number
          description?: string | null
          description_en?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          items?: string[] | null
          original_price?: number
          restaurant_id?: string
          starts_at?: string | null
          title?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deals_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      gardens: {
        Row: {
          created_at: string
          created_by: string | null
          has_fence: boolean | null
          has_lighting: boolean | null
          has_parking: boolean | null
          has_shade: boolean | null
          has_water: boolean | null
          id: string
          image_url: string | null
          lat: number
          lng: number
          location: string
          location_en: string | null
          name: string
          name_en: string | null
          rating: number | null
          reviews_count: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          has_fence?: boolean | null
          has_lighting?: boolean | null
          has_parking?: boolean | null
          has_shade?: boolean | null
          has_water?: boolean | null
          id?: string
          image_url?: string | null
          lat: number
          lng: number
          location: string
          location_en?: string | null
          name: string
          name_en?: string | null
          rating?: number | null
          reviews_count?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          has_fence?: boolean | null
          has_lighting?: boolean | null
          has_parking?: boolean | null
          has_shade?: boolean | null
          has_water?: boolean | null
          id?: string
          image_url?: string | null
          lat?: number
          lng?: number
          location?: string
          location_en?: string | null
          name?: string
          name_en?: string | null
          rating?: number | null
          reviews_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      hazard_reports: {
        Row: {
          admin_notes: string | null
          created_at: string
          description: string
          garden_id: string | null
          id: string
          image_url: string | null
          location_lat: number | null
          location_lng: number | null
          status: Database["public"]["Enums"]["hazard_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          description: string
          garden_id?: string | null
          id?: string
          image_url?: string | null
          location_lat?: number | null
          location_lng?: number | null
          status?: Database["public"]["Enums"]["hazard_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          description?: string
          garden_id?: string | null
          id?: string
          image_url?: string | null
          location_lat?: number | null
          location_lng?: number | null
          status?: Database["public"]["Enums"]["hazard_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hazard_reports_garden_id_fkey"
            columns: ["garden_id"]
            isOneToOne: false
            referencedRelation: "gardens"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          category: string
          category_en: string | null
          created_at: string
          description: string | null
          description_en: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          is_popular: boolean | null
          name: string
          name_en: string | null
          price: number
          restaurant_id: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category: string
          category_en?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_popular?: boolean | null
          name: string
          name_en?: string | null
          price: number
          restaurant_id: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          category_en?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_popular?: boolean | null
          name?: string
          name_en?: string | null
          price?: number
          restaurant_id?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          items: Json
          notes: string | null
          restaurant_id: string
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          items?: Json
          notes?: string | null
          restaurant_id: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          items?: Json
          notes?: string | null
          restaurant_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      peak_hours: {
        Row: {
          day_of_week: number
          garden_id: string
          hour: number
          id: string
          updated_at: string
          visitor_count: number
        }
        Insert: {
          day_of_week: number
          garden_id: string
          hour: number
          id?: string
          updated_at?: string
          visitor_count?: number
        }
        Update: {
          day_of_week?: number
          garden_id?: string
          hour?: number
          id?: string
          updated_at?: string
          visitor_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "peak_hours_garden_id_fkey"
            columns: ["garden_id"]
            isOneToOne: false
            referencedRelation: "gardens"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          favorite_garden_id: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          favorite_garden_id?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          favorite_garden_id?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          created_at: string
          delivery_note: string | null
          delivery_note_en: string | null
          garden_id: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          name_en: string | null
          opening_hours: Json | null
          owner_id: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivery_note?: string | null
          delivery_note_en?: string | null
          garden_id?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          name_en?: string | null
          opening_hours?: Json | null
          owner_id?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivery_note?: string | null
          delivery_note_en?: string | null
          garden_id?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          name_en?: string | null
          opening_hours?: Json | null
          owner_id?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurants_garden_id_fkey"
            columns: ["garden_id"]
            isOneToOne: false
            referencedRelation: "gardens"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          garden_id: string
          id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          garden_id: string
          id?: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          garden_id?: string
          id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_garden_id_fkey"
            columns: ["garden_id"]
            isOneToOne: false
            referencedRelation: "gardens"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "restaurant_owner" | "user"
      hazard_status: "open" | "in_progress" | "resolved"
      order_status:
        | "pending"
        | "confirmed"
        | "preparing"
        | "ready"
        | "delivered"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "restaurant_owner", "user"],
      hazard_status: ["open", "in_progress", "resolved"],
      order_status: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "delivered",
        "cancelled",
      ],
    },
  },
} as const
