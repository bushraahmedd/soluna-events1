import { createClient } from '@supabase/supabase-js';

// Provide placeholder values during build to prevent Supabase client from crashing.
// These will be overridden by real environment variables in Vercel.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://apicsvdfvouqraercnmv.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaWNzdmRmdm91cXJhZXJjbm12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NTg2NDQsImV4cCI6MjA4NDIzNDY0NH0.J-WhVg9vl95OgDDcVDYCS4DgBruJkhdsva767u9Ko84';

export const supabase = createClient(supabaseUrl, supabaseKey);
