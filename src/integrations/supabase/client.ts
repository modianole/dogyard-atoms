
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// ניסיון לקחת מהסביבה של Vite, ואם לא קיים - להשתמש בערך ריק כדי למנוע קריסה
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || "";

console.log("🛠️ Supabase Client Initializing...");
console.log("🔗 URL:", SUPABASE_URL ? "Defined" : "MISSING!");
console.log("🔑 Key:", SUPABASE_PUBLISHABLE_KEY ? "Defined" : "MISSING!");

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error("❌ Supabase credentials are missing! Check your .env file.");
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
