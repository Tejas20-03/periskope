"use server";

import { createClient } from "@/utils/supabase/server";
import { User } from "@/types";

export async function getUsers(): Promise<{
  users: User[] | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("user_profiles").select("*");

    if (error) {
      return { users: null, error: error.message };
    }

    return { users: data as User[], error: null };
  } catch (error) {
    return {
      users: null,
      error: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
}

export async function getCurrentUser(): Promise<{
  user: User | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return {
        user: null,
        error: authError?.message || "User not authenticated",
      };
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", authUser.email)
      .single();

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data as User, error: null };
  } catch (error) {
    return {
      user: null,
      error:
        error instanceof Error ? error.message : "Failed to fetch current user",
    };
  }
}
