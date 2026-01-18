import { createClient } from '@supabase/supabase-js';

// Provide placeholder values during build to prevent Supabase client from crashing.
// These will be overridden by real environment variables in Vercel.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
