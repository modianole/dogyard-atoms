export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      check_ins: {
        Row: {
          id: string
          user_id: string
          garden_id: string
          dog_id: string | null
          status: Database["public"]["Enums"]["check_in_status"]
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          garden_id: string
          dog_id?: string | null
          status?: Database["public"]["Enums"]["check_in_status"]
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          garden_id?: string
          dog_id?: string | null
          status?: Database["public"]["Enums"]["check_in_status"]
          expires_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_garden_id_fkey"
            columns: ["garden_id"]
            isOneToOne: false
            referencedRelation: "gardens"
            referencedColumns: ["id"]
          }
        ]
      }
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
          }
        ]
      }
      dogs: {
        Row: {
          id: string
          owner_id: string
          name: string
          breed: string | null
          birthday: string | null
          gender: Database["public"]["Enums"]["dog_gender"] | null
          size: Database["public"]["Enums"]["dog_size"] | null
          temperament: string[] | null
          bio: string | null
          image_url: string | null
          is_neutered: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          breed?: string | null
          birthday?: string | null
          gender?: Database["public"]["Enums"]["dog_gender"] | null
          size?: Database["public"]["Enums"]["dog_size"] | null
          temperament?: string[] | null
          bio?: string | null
          image_url?: string | null
          is_neutered?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          breed?: string | null
          birthday?: string | null
          gender?: Database["public"]["Enums"]["dog_gender"] | null
          size?: Database["public"]["Enums"]["dog_size"] | null
          temperament?: string[] | null
          bio?: string | null
          image_url?: string | null
          is_neutered?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      dog_profile_members: {
        Row: {
          id: string
          dog_id: string
          user_id: string
          role: Database["public"]["Enums"]["dog_share_role"]
          status: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          dog_id: string
          user_id: string
          role?: Database["public"]["Enums"]["dog_share_role"]
          status?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          dog_id?: string
          user_id?: string
          role?: Database["public"]["Enums"]["dog_share_role"]
          status?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dog_profile_members_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "dog_profile_members_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dog_profile_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      dog_share_invites: {
        Row: {
          id: string
          dog_id: string
          invited_by: string
          role: Database["public"]["Enums"]["dog_share_role"]
          token_hash: string
          expires_at: string
          accepted_by: string | null
          accepted_at: string | null
          revoked_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          dog_id: string
          invited_by: string
          role?: Database["public"]["Enums"]["dog_share_role"]
          token_hash: string
          expires_at: string
          accepted_by?: string | null
          accepted_at?: string | null
          revoked_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          dog_id?: string
          invited_by?: string
          role?: Database["public"]["Enums"]["dog_share_role"]
          token_hash?: string
          expires_at?: string
          accepted_by?: string | null
          accepted_at?: string | null
          revoked_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dog_share_invites_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "dog_share_invites_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dog_share_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      gardens: {
        Row: {
          created_at: string
          created_by: string | null
          google_place_id: string | null
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
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          google_place_id?: string | null
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
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          google_place_id?: string | null
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
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      protected_spaces: {
        Row: {
          capacity: number | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          created_by: string | null
          google_place_id: string | null
          id: string
          image_url: string | null
          is_accessible: boolean | null
          lat: number
          lng: number
          location: string
          location_en: string | null
          name: string
          name_en: string | null
          rating: number | null
          reviews_count: number | null
          type: string | null
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          google_place_id?: string | null
          id?: string
          image_url?: string | null
          is_accessible?: boolean | null
          lat: number
          lng: number
          location: string
          location_en?: string | null
          name: string
          name_en?: string | null
          rating?: number | null
          reviews_count?: number | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          google_place_id?: string | null
          id?: string
          image_url?: string | null
          is_accessible?: boolean | null
          lat?: number
          lng?: number
          location?: string
          location_en?: string | null
          name?: string
          name_en?: string | null
          rating?: number | null
          reviews_count?: number | null
          type?: string | null
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
          }
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
          }
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
          }
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
          }
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
          created_at?: string | null
          display_name?: string | null
          favorite_garden_id?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          favorite_garden_id?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
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
          }
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
          }
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
      active_garden_visitors: {
        Row: {
          id: string
          user_id: string
          garden_id: string
          dog_id: string | null
          status: Database["public"]["Enums"]["check_in_status"]
          current_status: Database["public"]["Enums"]["check_in_status"]
          expires_at: string
          created_at: string
        }
      }
    }
    Functions: {
      accept_dog_share_invite: {
        Args: {
          p_token: string
        }
        Returns: Json
      }
      create_dog_share_invite: {
        Args: {
          p_dog_id: string
          p_role?: Database["public"]["Enums"]["dog_share_role"]
          p_expires_in_hours?: number
        }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      get_nearby_gardens: {
        Args: {
          user_lat: number
          user_lng: number
          radius_meters: number
        }
        Returns: Database["public"]["Tables"]["gardens"]["Row"][]
      }
    }
    Enums: {
      app_role: "admin" | "restaurant_owner" | "user"
      dog_share_role: "owner" | "editor" | "viewer"
      dog_size: "small" | "medium" | "large" | "giant"
      dog_gender: "male" | "female"
      hazard_status: "open" | "in_progress" | "resolved"
      check_in_status: "arrived" | "on_way"
      order_status:
        | "pending"
        | "confirmed"
        | "preparing"
        | "ready"
        | "delivered"
        | "cancelled"
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
