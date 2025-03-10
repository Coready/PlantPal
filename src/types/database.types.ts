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
      care_tasks: {
        Row: {
          id: string;
          plant_id: string;
          task_type: string;
          due_date: string;
          completed: boolean | null;
          completed_date: string | null;
          notes: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          plant_id: string;
          task_type: string;
          due_date: string;
          completed?: boolean | null;
          completed_date?: string | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          plant_id?: string;
          task_type?: string;
          due_date?: string;
          completed?: boolean | null;
          completed_date?: string | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "care_tasks_plant_id_fkey";
            columns: ["plant_id"];
            referencedRelation: "plants";
            referencedColumns: ["id"];
          },
        ];
      };
      plant_entries: {
        Row: {
          id: string;
          plant_id: string;
          entry_date: string | null;
          image_url: string | null;
          height: number | null;
          num_leaves: number | null;
          notes: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          plant_id: string;
          entry_date?: string | null;
          image_url?: string | null;
          height?: number | null;
          num_leaves?: number | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          plant_id?: string;
          entry_date?: string | null;
          image_url?: string | null;
          height?: number | null;
          num_leaves?: number | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "plant_entries_plant_id_fkey";
            columns: ["plant_id"];
            referencedRelation: "plants";
            referencedColumns: ["id"];
          },
        ];
      };
      plants: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          species: string | null;
          image_url: string | null;
          location: string | null;
          acquired_date: string | null;
          notes: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          species?: string | null;
          image_url?: string | null;
          location?: string | null;
          acquired_date?: string | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          species?: string | null;
          image_url?: string | null;
          location?: string | null;
          acquired_date?: string | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "plants_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          credits: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          image: string | null;
          name: string | null;
          subscription: string | null;
          token_identifier: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          credits?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          image?: string | null;
          name?: string | null;
          subscription?: string | null;
          token_identifier: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          credits?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          image?: string | null;
          name?: string | null;
          subscription?: string | null;
          token_identifier?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
