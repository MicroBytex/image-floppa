
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

// Define a more detailed user profile type if you extend Supabase users table
// or have a separate 'profiles' table.
export interface UserProfile extends User {
  name?: string | null; // Example: if you have a 'name' column in your profiles table
  plan?: string; // e.g., 'free', 'pro', 'enterprise'
  storage_limit?: number;
  storage_used?: number;
}

export async function requireAuth(): Promise<UserProfile> {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.log("No user session found, redirecting to login.");
    redirect("/login");
  }

  // Here, you might want to fetch additional profile information
  // from your 'profiles' table based on user.id
  // For example:
  // const { data: profile, error: profileError } = await supabase
  //   .from('profiles')
  //   .select('*')
  //   .eq('id', user.id)
  //   .single();
  //
  // if (profileError || !profile) {
  //   // Handle error or missing profile, maybe redirect or return basic user
  //   console.error("Error fetching profile or profile not found:", profileError);
  //   // Fallback or throw error
  // }
  //
  // return { ...user, ...profile } as UserProfile;

  // For now, returning the basic user object, cast to UserProfile
  // You'll need to ensure your UserProfile type matches what you actually fetch/return
  return user as UserProfile; 
}
