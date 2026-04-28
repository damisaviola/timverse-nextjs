"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signJwt } from "@/lib/jwt";
import { cookies } from "next/headers";

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

    // Set custom JWT for admin routing
    const token = await signJwt({ 
      id: data.user.id, 
      email: data.user.email, 
      role: "admin" 
    });

    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 // 24 hours
    });
  }

  redirect("/admin");
}

export async function signup(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    return { error: "Kata sandi tidak cocok." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        phone: phone,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/login?message=Cek email Anda untuk verifikasi akun.");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const cookieStore = await cookies();
  cookieStore.delete("admin_token");

  redirect("/admin-login");
}
