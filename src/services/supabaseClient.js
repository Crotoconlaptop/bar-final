import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hpnsdngwonflbjntcuwa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwbnNkbmd3b25mbGJqbnRjdXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MTU1OTIsImV4cCI6MjA1OTk5MTU5Mn0.s7j1nfuK5mtOSwXaSySiyyQSV4XL_DdToDIVY7IMlQs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
