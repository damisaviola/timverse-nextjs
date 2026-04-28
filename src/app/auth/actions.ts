"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signJwt } from "@/lib/jwt";
import { cookies } from "next/headers";

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
 * Mengecek kredensial dan memverifikasi peran di tabel 'admins'.
 */
export async function adminLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: getFriendlyErrorMessage(error) };
  }

  if (data.user) {
    // Verifikasi peran admin di database
    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (adminError || !adminData) {
      await supabase.auth.signOut();
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
  }

  return redirect("/login?success=true");
}

/**
 * Menghancurkan sesi pengguna dan menghapus cookie otorisasi.
 * Menangani logout baik untuk Admin maupun Pengguna biasa.
 */
export async function logout() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // Tentukan apakah ini admin atau user biasa untuk redirect yang tepat
  const isAdmin = (await cookies()).get("admin_token")?.value;

  await supabase.auth.signOut();

  const cookieStore = await cookies();
  cookieStore.delete("admin_token");

  // Jika sebelumnya admin, balikkan ke login admin, jika user biasa balikkan ke halaman login
  if (isAdmin) {
    return redirect("/admin-login");
  }
  
  return redirect("/login");
}
