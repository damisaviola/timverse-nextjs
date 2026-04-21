import {
  Cpu,
  Briefcase,
  Trophy,
  Clapperboard,
  Atom,
  Landmark,
  LayoutGrid,
  Newspaper,
  Compass,
  Brain,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface CategoryIconData {
  icon: LucideIcon;
  color: string;
  gradient: string;
}

export const categoryIcons: Record<string, CategoryIconData> = {
  Semua: {
    icon: LayoutGrid,
    color: "text-accent",
    gradient: "from-sky-500 to-cyan-400",
  },
  Teknologi: {
    icon: Cpu,
    color: "text-blue-500",
    gradient: "from-blue-500 to-cyan-400",
  },
  Bisnis: {
    icon: Briefcase,
    color: "text-emerald-500",
    gradient: "from-emerald-500 to-teal-400",
  },
  Olahraga: {
    icon: Trophy,
    color: "text-orange-500",
    gradient: "from-orange-500 to-amber-400",
  },
  Hiburan: {
    icon: Clapperboard,
    color: "text-pink-500",
    gradient: "from-pink-500 to-rose-400",
  },
  Sains: {
    icon: Atom,
    color: "text-purple-500",
    gradient: "from-purple-500 to-violet-400",
  },
  Politik: {
    icon: Landmark,
    color: "text-red-500",
    gradient: "from-red-500 to-rose-400",
  },
  Media: {
    icon: Newspaper,
    color: "text-indigo-500",
    gradient: "from-indigo-500 to-blue-400",
  },
  Career: {
    icon: Compass,
    color: "text-teal-500",
    gradient: "from-teal-500 to-emerald-400",
  },
  Psychology: {
    icon: Brain,
    color: "text-violet-500",
    gradient: "from-violet-500 to-purple-400",
  },
  "Inside TIMVERSE": {
    icon: Sparkles,
    color: "text-amber-500",
    gradient: "from-amber-500 to-yellow-400",
  },
};
