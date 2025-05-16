import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = "https://sgdtonxdhxzjsffeerib.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnZHRvbnhkaHh6anNmZmVlcmliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNjkzMjEsImV4cCI6MjA2Mjk0NTMyMX0.Yg59zBjBY3ZCf6-vkBb9JkRbcHcQg-b3-_LaaNM_NVU"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});