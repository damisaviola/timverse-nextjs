"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Anda harus login untuk memperbarui profil." };
  }

  const full_name = formData.get("full_name") as string;
  const username = formData.get("username") as string;
  const phone_number = formData.get("phone_number") as string;
  const avatar_url = formData.get("avatar_url") as string;

  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name,
        username,
        phone_number,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      if (error.message.includes("unique constraint") && error.message.includes("username")) {
        return { error: "Username sudah digunakan, silakan pilih nama lain." };
      }
      return { error: error.message };
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
