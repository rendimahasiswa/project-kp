import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient('https://thbkifrgublrnabweyyl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoYmtpZnJndWJscm5hYndleXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4ODEzMzksImV4cCI6MjA3NzQ1NzMzOX0.Cr8PVCF19cBIMe5eksT3O9Fz6fsCcnHFGqp2FG-gyWs')