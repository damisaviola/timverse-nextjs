import {
  Cpu,
  Briefcase,
  Trophy,
  Clapperboard,
  Atom,
  Landmark,
  LayoutGrid,
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
};
