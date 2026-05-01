"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "@/context/ThemeContext";

interface TinyEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function TinyEditor({ value, onChange }: TinyEditorProps) {
  const { theme } = useTheme();

  return (
    <div className="w-full rounded-[2rem] overflow-hidden border border-border/40 shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500/20">
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINY_API_KEY}
        value={value}
        onEditorChange={onChange}
        // Force re-render on theme change to update skin
        key={theme}
        init={{
          height: 650,
          menubar: false,
          plugins: [
            "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
            "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
            "insertdatetime", "media", "table", "help", "wordcount"
          ],
          toolbar: 
            "undo redo | blocks | " +
            "bold italic underline strikethrough | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "link image table | code preview fullscreen | help",
          content_style: "body { font-family:var(--font-outfit),Helvetica,Arial,sans-serif; font-size:16px }",
          
          // Image Upload Integration
          image_advtab: true,
          images_upload_handler: async (blobInfo: any) => {
            try {
              const { createClient } = await import("@/lib/supabase/client");
              const supabase = createClient();
              const file = blobInfo.blob();
              const fileName = `content/${Date.now()}-${blobInfo.filename()}`;
              
              const { data, error } = await supabase.storage
                .from("news-content")
                .upload(fileName, file);

              if (error) throw error;

              const { data: { publicUrl } } = supabase.storage
                .from("news-content")
                .getPublicUrl(data.path);

              return publicUrl;
            } catch (error) {
              console.error("Upload failed:", error);
              throw new Error("Gagal mengunggah gambar ke storage.");
            }
          },
          
          // Theme Integration
          skin: theme === "dark" ? "oxide-dark" : "oxide",
          content_css: theme === "dark" ? "dark" : "default",
          
          // Customization for Midnight Navy integration
          setup: (editor: any) => {
            editor.on("init", () => {
              if (theme === "dark") {
                // Minor tweaks to match Midnight Navy
              }
            });
          },
          
          branding: false,
          promotion: false,
        }}
      />
    </div>
  );
}
