"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth-utils";

export async function fetchMonitorUsers() {
  try {
    await requireAdmin();
    const supabaseAdmin = await createAdminClient();

    // 1. Fetch users from auth.users (requires service role)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error("Fetch Auth Users Error:", authError);
      return { error: "Gagal memuat data autentikasi pengguna: " + authError.message };
    }

    const authUsers = authData.users;

    // 2. Fetch profiles from public.profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, avatar_url, phone_number");

    if (profilesError) {
      console.error("Fetch Profiles Error:", profilesError);
    }

    // 3. Fetch admins from public.admins
    const { data: admins, error: adminsError } = await supabaseAdmin
      .from("admins")
      .select("id, role");

    if (adminsError) {
      console.error("Fetch Admins Error:", adminsError);
    }

    // 4. Merge data
    const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);
    const adminsMap = new Map(admins?.map(a => [a.id, a]) || []);

    const mergedUsers = authUsers.map(u => {
      const profile = profilesMap.get(u.id);
      const adminData = adminsMap.get(u.id);

      return {
        id: u.id,
        email: u.email || "No Email",
        full_name: profile?.full_name || u.user_metadata?.full_name || "Pengguna Timverse",
        avatar_url: profile?.avatar_url || u.user_metadata?.avatar_url || null,
        role: (adminData ? "admin" : "user") as "admin" | "user",
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at || null,
        phone_number: profile?.phone_number || null,
      };
    });

    // Sort by created_at desc (newest first)
    mergedUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return { data: mergedUsers };
  } catch (error: any) {
    console.error("Monitor Users Exception:", error);
    return { error: error.message || "Terjadi kesalahan sistem saat memuat pengguna." };
  }
}

/**
 * Mengambil statistik aktivitas pengguna (jumlah komentar, likes, pengaduan).
 */
export async function fetchUserStats(userId: string) {
  try {
    await requireAdmin();
    const supabaseAdmin = await createAdminClient();

    const [commentsRes, likesRes, reportsRes] = await Promise.all([
      supabaseAdmin.from("comments").select("*", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin.from("likes").select("*", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin.from("reports").select("*", { count: "exact", head: true }).eq("user_id", userId)
    ]);

    return {
      commentsCount: commentsRes.count || 0,
      likesCount: likesRes.count || 0,
      reportsCount: reportsRes.count || 0
    };
  } catch (error) {
    console.error("Fetch User Stats Error:", error);
    return { commentsCount: 0, likesCount: 0, reportsCount: 0 };
  }
}

/**
 * Mengambil berita-berita yang di-like oleh pengguna.
 */
export async function fetchUserLikes(userId: string) {
  try {
    await requireAdmin();
    const supabaseAdmin = await createAdminClient();
    
    // Query likes and join news table. We alias news_id to news if needed, or query direct.
    // In Supabase, if foreign key links to news table, we select news(...)
    const { data, error } = await supabaseAdmin
      .from("likes")
      .select("id, created_at, news:news_id (id, title, slug)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch User Likes DB Error:", error);
      throw error;
    }

    return { data: data || [] };
  } catch (error: any) {
    console.error("Fetch User Likes Error:", error);
    return { error: error.message || "Gagal memuat berita yang disukai." };
  }
}

/**
 * Mengambil semua komentar yang ditulis oleh pengguna.
 */
export async function fetchUserComments(userId: string) {
  try {
    await requireAdmin();
    const supabaseAdmin = await createAdminClient();

    const { data, error } = await supabaseAdmin
      .from("comments")
      .select("id, content, created_at, news:news_id (id, title, slug)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch User Comments DB Error:", error);
      throw error;
    }

    return { data: data || [] };
  } catch (error: any) {
    console.error("Fetch User Comments Error:", error);
    return { error: error.message || "Gagal memuat komentar pengguna." };
  }
}
