"use client";

import { useState, useRef, useEffect } from "react";
import { Type, Minus, Plus, ChevronDown, Play, Pause, Square, Volume2 } from "lucide-react";

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
  title?: string;
}

export default function ReadingToolbar({ content, title = "" }: ReadingToolbarProps) {
  const [sizeIndex, setSizeIndex] = useState(1); // Default = Normal
  const [fontIndex, setFontIndex] = useState(0); // Default = Outfit
  const [showFontMenu, setShowFontMenu] = useState(false);
  
  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const currentSize = SIZE_STEPS[sizeIndex];
  const currentFont = FONT_OPTIONS[fontIndex];

  const decreaseSize = () => setSizeIndex((prev) => Math.max(0, prev - 1));
  const increaseSize = () => setSizeIndex((prev) => Math.min(SIZE_STEPS.length - 1, prev + 1));

  // Audio Logic
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
    
    return () => {
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const handlePlay = () => {
    if (!synthRef.current) return;

    if (isPaused) {
      synthRef.current.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    const textToRead = `${title}. ${stripHtml(content)}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Cari suara Bahasa Indonesia
    const voices = synthRef.current.getVoices();
    const idVoice = voices.find(v => v.lang.includes("id-ID") || v.lang.includes("id_ID"));
    if (idVoice) utterance.voice = idVoice;
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (synthRef.current && isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  return (
    <div className="mt-10">
      {/* Toolbar Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8 p-4 bg-surface/50 backdrop-blur-sm rounded-[2rem] border border-border shadow-sm">
        
        {/* Grup 1: Kontrol Audio */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500 ${isPlaying ? "bg-accent/20 text-accent shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]" : "bg-background border border-border/60 text-secondary"}`}>
            <Volume2 size={18} className={isPlaying ? "animate-pulse" : ""} />
          </div>
          
          <div className="flex items-center gap-2">
            {!isPlaying ? (
              <button
                onClick={handlePlay}
                className="flex items-center gap-2 h-10 px-5 bg-accent text-white rounded-xl text-[10px] font-black uppercase tracking-[0.1em] hover:bg-accent-dark hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-accent/20"
              >
                <Play size={14} fill="currentColor" />
                {isPaused ? "Lanjutkan" : "Dengarkan"}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 h-10 px-5 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.1em] hover:bg-amber-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-amber-500/20"
              >
                <Pause size={14} fill="currentColor" />
                Jeda
              </button>
            )}
            
            {(isPlaying || isPaused) && (
              <button
                onClick={handleStop}
                className="flex items-center justify-center w-10 h-10 bg-background border border-border text-secondary hover:text-red-500 hover:border-red-500/30 rounded-xl transition-all"
                title="Berhenti"
              >
                <Square size={14} fill="currentColor" />
              </button>
            )}
          </div>
        </div>

        {/* Divider (Desktop Only) */}
        <div className="hidden md:block w-px h-8 bg-border/60" />

        {/* Grup 2: Kontrol Teks */}
        <div className="flex flex-wrap items-center gap-5">
          {/* Font Size */}
          <div className="flex items-center bg-background border border-border/60 rounded-xl p-1">
            <button
              onClick={decreaseSize}
              disabled={sizeIndex === 0}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-secondary hover:bg-surface hover:text-foreground disabled:opacity-20 transition-all"
            >
              <Minus size={14} />
            </button>
            <div className="px-3 min-w-[80px] text-center">
              <span className="text-[10px] font-black text-foreground uppercase tracking-widest select-none">
                {currentSize.label}
              </span>
            </div>
            <button
              onClick={increaseSize}
              disabled={sizeIndex === SIZE_STEPS.length - 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-secondary hover:bg-surface hover:text-foreground disabled:opacity-20 transition-all"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Font Family Selector */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowFontMenu(!showFontMenu)}
              className="flex items-center gap-3 h-10 px-4 bg-background border border-border/60 rounded-xl hover:border-accent/40 transition-all group"
            >
              <Type size={14} className="text-muted group-hover:text-accent" />
              <span style={{ fontFamily: currentFont.value }} className="text-[11px] font-bold text-secondary group-hover:text-foreground">
                {currentFont.label}
              </span>
              <ChevronDown size={14} className={`text-muted transition-transform duration-300 ${showFontMenu ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown */}
            {showFontMenu && (
              <div className="absolute right-0 bottom-full sm:bottom-auto sm:top-full mb-2 sm:mb-0 sm:mt-2 w-48 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-1.5">
                  {FONT_OPTIONS.map((font, i) => (
                    <button
                      key={font.label}
                      onClick={() => {
                        setFontIndex(i);
                        setShowFontMenu(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all
                        ${i === fontIndex
                          ? "bg-accent text-white font-bold"
                          : "text-secondary hover:bg-surface hover:text-foreground"
                        }
                      `}
                      style={{ fontFamily: font.value }}
                    >
                      <span className="text-sm">{font.label}</span>
                      <span className={`block text-[10px] mt-0.5 opacity-60 ${i === fontIndex ? "text-white" : ""}`}>
                        The quick brown fox
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
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
