import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token")?.value;

  if (!adminToken) {
    redirect("/admin-login");
  }

  const payload = await verifyJwt(adminToken);

  if (!payload || payload.role !== "admin") {
    cookieStore.delete("admin_token");
    redirect("/admin-login");
  }

  const supabase = await createClient();
  
  // 2. Check for admin role in database (Real-time revocation check)
  const { data: adminData, error: adminError } = await supabase
    .from("admins")
    .select("*")
    .eq("id", payload.id)
    .single();

  if (adminError || !adminData) {
    // If not an admin, clear custom token, and redirect
    cookieStore.delete("admin_token");
    redirect("/admin-login");
  }

  // Create a mock user object for the AdminLayoutClient based on the JWT payload
  // so we don't break existing components that expect a user object.
  const mockUser = {
    id: payload.id as string,
    email: payload.email as string,
  };

  return (
    <AdminLayoutClient user={mockUser as any}>
      {children}
    </AdminLayoutClient>
  );
}
