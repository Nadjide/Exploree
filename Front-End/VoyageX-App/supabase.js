import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://uyrjanwysoccomxvjksx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cmphbnd5c29jY29teHZqa3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMxNjc1OTQsImV4cCI6MjAyODc0MzU5NH0.bSLz_od5wb4lO9qVndaAMbTY_XgHYEDi4CDt3sH9p3Q'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)