"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signJwt } from "@/lib/jwt";
import { cookies } from "next/headers";
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";

/**
 * Menerjemahkan pesan error teknis menjadi bahasa yang ramah pengguna.
 * @param error - Objek error dari Supabase atau Database.
 * @returns Pesan error dalam bahasa Indonesia yang ramah pengguna.
 */
function getFriendlyErrorMessage(error: any): string {
  const message = error?.message || "";
  
  if (message.includes("Invalid login credentials")) {
    return "Email atau kata sandi yang Anda masukkan salah.";
  }
  if (message.includes("User already registered")) {
    return "Email ini sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.";
  }
  if (message.includes("violates row-level security policy")) {
    return "Maaf, terjadi kesalahan sistem saat menyimpan profil Anda. Silakan coba lagi nanti.";
  }
  if (message.includes("unique constraint") || message.includes("duplicate key")) {
    if (message.includes("username")) return "Username ini sudah digunakan, silakan pilih yang lain.";
    return "Data ini sudah terdaftar di sistem kami.";
  }
  if (message.includes("Email not confirmed")) {
    return "Akun Anda belum diverifikasi. Silakan cek email Anda.";
  }
  if (message.includes("Database error")) {
    return "Terjadi masalah pada server kami. Silakan coba lagi nanti.";
  }
  
  return "Terjadi kesalahan yang tidak terduga. Silakan coba lagi.";
}

/**
 * Melakukan proses login khusus untuk Administrator.
 * Mengecek kredensial secara terisolasi tanpa menimpa sesi User yang sedang aktif.
 */
export async function adminLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // Gunakan client dasar (non-SSR) agar proses autentikasi admin INI TIDAK MENULIS/MENIMPA
  // cookie session milik User biasa. Ini menciptakan isolasi total antara Admin & User.
  const supabaseIsolated = createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabaseIsolated.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: getFriendlyErrorMessage(error) };
  }

  if (data.user) {
    // Verifikasi peran admin di database
    const { data: adminData, error: adminError } = await supabaseIsolated
      .from("admins")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (adminError || !adminData) {
      await supabaseIsolated.auth.signOut();
      return { error: "Akses ditolak. Akun Anda tidak terdaftar sebagai administrator." };
    }

    // Buat JWT kustom untuk otorisasi routing admin
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
      maxAge: 60 * 60 * 24 // 24 jam
    });
  }

  return redirect("/admin");
}

/**
 * Melakukan proses login untuk pengguna reguler.
 */
export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: getFriendlyErrorMessage(error) };
  }

  return redirect("/");
}

/**
 * Melakukan proses pendaftaran pengguna baru.
 * Mencakup pembuatan akun Auth dan entri profil di database.
 */
export async function signup(formData: FormData) {
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validasi kecocokan sandi
  if (password !== confirmPassword) {
    return { error: "Konfirmasi kata sandi tidak sesuai." };
  }

  const supabase = await createClient();

  // 1. Cek ketersediaan username
  const { data: existingUser } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .maybeSingle();

  if (existingUser) {
    return { error: "Username sudah digunakan, silakan pilih nama lain." };
  }

  // 2. Registrasi Akun Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        username: username,
        phone: phone,
      },
    },
  });

  if (error) {
    return { error: getFriendlyErrorMessage(error) };
  }

  // 3. Sinkronisasi data ke tabel profil (Upsert untuk menghindari duplikasi)
  if (data.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: data.user.id,
        username: username,
        full_name: name,
        phone_number: phone,
      });

    if (profileError) {
      console.error("Critical: Profile sync failed:", profileError);
      return { error: "Berhasil mendaftar, namun gagal menyiapkan profil: " + getFriendlyErrorMessage(profileError) };
    }

    // Force sign out immediately after signup to prevent automatic login
    // This ensures the user is redirected to the login page to manually authenticate
    await supabase.auth.signOut();
  }

  return redirect("/login?success=true");
}

/**
 * Menghancurkan sesi pengguna (User Biasa).
 * Mengarahkannya ke beranda, tidak menyentuh sesi Admin jika ada.
 */
export async function userLogout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  // Mengarahkan user ke halaman beranda (home) setelah berhasil logout
  return redirect("/");
}

/**
 * Menghancurkan sesi Admin secara terpisah.
 * Tidak menyentuh sesi User jika ada.
 */
export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");

  return redirect("/admin-login");
}
