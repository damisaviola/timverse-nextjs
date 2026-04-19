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
        apiKey="yoxf2duuzbc3kgfb2lc7fsl76on733l64csjdnjmxs4ymuby" // User can replace this with their own key
        value={value}
        onEditorChange={onChange}
        // Force re-render on theme change to update skin
        key={theme}
        init={{
          height: 650,
          menubar: false,
          plugins: [
            "advlist", "autolink", "lists", "link", "charmap", "preview",
            "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
            "insertdatetime", "media", "table", "help", "wordcount"
          ],
          toolbar: 
            "undo redo | blocks | " +
            "bold italic underline strikethrough | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "link table | code preview fullscreen | help",
          content_style: "body { font-family:var(--font-outfit),Helvetica,Arial,sans-serif; font-size:16px }",
          
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
