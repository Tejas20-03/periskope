"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { SignInForm, SignUpForm } from "@/types";

export async function signUp(formData: FormData) {
  const supabase = createClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phoneNumber = formData.get("phoneNumber") as string;

  const { error, data } = await (
    await supabase
  ).auth.signUp({
    email,
    password,
    options: {
      data: {
        username: name,
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
  const { error: profileError } = await (await supabase)
    .from("user_profiles")
    .insert({
      email: email,
      username: name,
      phone_number: phoneNumber,
      groups: [],
      last_seen: new Date().toISOString(),
      status: "offline",
    });

  if (profileError) {
    return {
      status: `Profile creation failed: ${profileError.message}`,
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
        phone_number: data?.user?.user_metadata.phoneNumber,
        avatar_url: data?.user?.user_metadata.avatarUrl,
        groups: data?.user?.user_metadata.groups || [],
        last_seen: new Date().toISOString(),
        status: "online",
      });
    if (insertError) {
      return {
        status: insertError?.message,
        user: null,
      };
    }
  } else {
    const { error: updateError } = await (
      await supabase
    )
      .from("user_profiles")
      .update({
        status: "online",
        last_seen: new Date().toISOString(),
      })
      .eq("email", credentials?.email);

    if (updateError) {
      return {
        status: updateError?.message,
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

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (user) {
    await (
      await supabase
    )
      .from("user_profiles")
      .update({
        status: "offline",
        last_seen: new Date().toISOString(),
      })
      .eq("email", user.email);
  }

  const { error } = await (await supabase).auth.signOut();
  if (error) {
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect("/login");
}
