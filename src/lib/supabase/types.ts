export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      [table: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: unknown[];
      };
    };
    Views: { [view: string]: never };
    Functions: { [fn: string]: never };
    Enums: { [name: string]: never };
    CompositeTypes: { [name: string]: never };
  };
};
