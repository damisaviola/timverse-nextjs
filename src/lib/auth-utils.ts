import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

/**
 * Memastikan request dilakukan oleh Admin yang valid.
 * Melempar error jika tidak valid.
 */
export async function requireAdmin() {
  const adminToken = (await cookies()).get("admin_token")?.value;
  if (!adminToken) throw new Error("Unauthorized: Admin token missing");

  const payload = await verifyJwt(adminToken);
  if (!payload || payload.role !== "admin") {
    throw new Error("Unauthorized: Invalid admin credentials");
  }

  // Double Check di database untuk keamanan ekstra (real-time revocation)
  const supabase = await createClient();
  const { data: adminData } = await supabase
    .from("admins")
    .select("id")
    .eq("id", payload.id)
    .single();

  if (!adminData) {
    throw new Error("Unauthorized: Admin privileges revoked");
  }

  return payload;
}

/**
 * Memastikan request dilakukan oleh User yang sudah login.
 */
export async function requireUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized: User session missing");
  }

  return user;
}
