"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { SignInForm, SignUpForm } from "@/types";

export async function signUp(formData: SignUpForm) {
  const supabase = createClient();
  const credentials = {
    username: formData.name,
    email: formData.email,
    password: formData.password,
  };

  const { error, data } = await (
    await supabase
  ).auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        username: credentials.username,
      },
    },
  });

  if (error) {
    return {
      status: error?.message,
      user: null,
    };
  } else if (data?.user?.identities?.length === 0) {
    return {
      status: "User with this email already exists, Please Login!",
      user: null,
    };
  }
  revalidatePath("/", "layout");
  return {
    status: "success",
    user: data.user,
  };
}

export async function signIn(formData: SignInForm) {
  const supabase = createClient();
  const credentials = {
    email: formData.email,
    password: formData.password,
  };
  const { error, data } = await (
    await supabase
  ).auth.signInWithPassword(credentials);

  if (error) {
    return {
      status: error?.message,
      user: null,
    };
  }

  const { data: existingUser } = await (await supabase)
    .from("user_profiles")
    .select("*")
    .eq("email", credentials?.email)
    .limit(1)
    .single();

  if (!existingUser) {
    const { error: insertError } = await (await supabase)
      .from("user_profiles")
      .insert({
        email: data?.user?.email,
        username: data?.user?.user_metadata.username,
      });
    if (insertError) {
      return {
        status: insertError?.message,
        user: null,
      };
    }
  }
  revalidatePath("/", "layout");

  return {
    status: "success",
    user: data.user,
  };
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await (await supabase).auth.signOut();
  if (error) {
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect("/login");
}
