import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
    'https://gdzrkcziftzctnajiwzx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkenJrY3ppZnR6Y3RuYWppd3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5ODcxNzMsImV4cCI6MjA2NzU2MzE3M30.yst9VGnBiJzJE1kVxAhk2eNG0tIlT7I95Q334KZWIVc'
)

