"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    // Verify admin role
    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (adminError || !adminData) {
      await supabase.auth.signOut();
      return { error: "Akses ditolak. Akun Anda tidak terdaftar sebagai admin." };
    }
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin-login");
}
