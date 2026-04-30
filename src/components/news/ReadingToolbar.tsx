"use client";

import { useState, useRef } from "react";
import { Type, Minus, Plus, ChevronDown } from "lucide-react";

const FONT_OPTIONS = [
  { label: "Default", value: "var(--font-outfit), system-ui, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Sans-Serif", value: "Inter, system-ui, sans-serif" },
  { label: "Monospace", value: "'Courier New', Courier, monospace" },
];

const SIZE_STEPS = [
  { label: "Kecil", base: "1rem", lg: "1.05rem", lineHeight: "1.75" },
  { label: "Normal", base: "1.125rem", lg: "1.2rem", lineHeight: "1.8" },
  { label: "Besar", base: "1.3rem", lg: "1.4rem", lineHeight: "1.85" },
  { label: "Sangat Besar", base: "1.5rem", lg: "1.6rem", lineHeight: "1.9" },
];

interface ReadingToolbarProps {
  content: string;
}

export default function ReadingToolbar({ content }: ReadingToolbarProps) {
  const [sizeIndex, setSizeIndex] = useState(1); // Default = Normal
  const [fontIndex, setFontIndex] = useState(0); // Default = Outfit
  const [showFontMenu, setShowFontMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentSize = SIZE_STEPS[sizeIndex];
  const currentFont = FONT_OPTIONS[fontIndex];

  const decreaseSize = () => setSizeIndex((prev) => Math.max(0, prev - 1));
  const increaseSize = () => setSizeIndex((prev) => Math.min(SIZE_STEPS.length - 1, prev + 1));

  return (
    <div className="mt-10">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-6 p-3 bg-surface rounded-2xl border border-border">
        {/* Font Size Controls */}
        <div className="flex items-center gap-2">
          <Type size={16} className="text-secondary" />
          <button
            onClick={decreaseSize}
            disabled={sizeIndex === 0}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-background border border-border text-secondary hover:text-foreground hover:border-accent/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Kecilkan teks"
          >
            <Minus size={14} />
          </button>
          <span className="text-xs font-semibold text-secondary min-w-[70px] text-center select-none">
            {currentSize.label}
          </span>
          <button
            onClick={increaseSize}
            disabled={sizeIndex === SIZE_STEPS.length - 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-background border border-border text-secondary hover:text-foreground hover:border-accent/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Besarkan teks"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Font Family Selector */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowFontMenu(!showFontMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background border border-border text-sm font-medium text-secondary hover:text-foreground hover:border-accent/40 transition-all"
          >
            <span style={{ fontFamily: currentFont.value }} className="text-xs">
              {currentFont.label}
            </span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${showFontMenu ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown */}
          {showFontMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
              {FONT_OPTIONS.map((font, i) => (
                <button
                  key={font.label}
                  onClick={() => {
                    setFontIndex(i);
                    setShowFontMenu(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors
                    ${i === fontIndex
                      ? "bg-accent/10 text-accent font-semibold"
                      : "text-secondary hover:bg-surface hover:text-foreground"
                    }
                  `}
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                  <span className="block text-[11px] opacity-60 mt-0.5" style={{ fontFamily: font.value }}>
                    Contoh teks bacaan
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div
        className="prose max-w-none
          [&_strong]:text-foreground [&_strong]:font-bold
          [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4
        "
        style={{
          fontSize: currentSize.base,
          lineHeight: currentSize.lineHeight,
          fontFamily: currentFont.value,
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
