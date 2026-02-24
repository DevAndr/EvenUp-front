import {BarChart2, type LucideIcon, Receipt, Users} from "lucide-react";
import type {CategoryId, SplitType, TabId} from "@/types/types.ts";
import {
    Utensils, Car, ShoppingCart, Home, Music, Plane, MoreHorizontal,
} from "lucide-react";
import type {FC} from "react";

export const AVATAR_COLORS = [
    "bg-indigo-500", "bg-violet-500", "bg-pink-500", "bg-amber-500",
    "bg-emerald-500", "bg-blue-500", "bg-red-500", "bg-teal-500",
] as const;


export interface CategoryConfig {
    icon: LucideIcon;
    id: CategoryId;
    label: string;
    color: string;
    bg: string;
}

export const CATEGORIES: CategoryConfig[] = [
    { id: "food",    label: "Еда",       icon: Utensils,     color: "text-orange-400",  bg: "bg-orange-400/10" },
    { id: "taxi",    label: "Такси",     icon: Car,          color: "text-blue-400",    bg: "bg-blue-400/10" },
    { id: "grocery", label: "Продукты",  icon: ShoppingCart, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { id: "home",    label: "Жильё",     icon: Home,         color: "text-violet-400",  bg: "bg-violet-400/10" },
    { id: "music",   label: "Досуг",     icon: Music,        color: "text-pink-400",    bg: "bg-pink-400/10" },
    { id: "plane",   label: "Транспорт", icon: Plane,        color: "text-indigo-400",  bg: "bg-indigo-400/10" },
    { id: "other",   label: "Другое",    icon: MoreHorizontal, color: "text-zinc-400",  bg: "bg-zinc-400/10" },
];

interface TabConfig { id: TabId; label: string; icon: LucideIcon }
export const TABS: TabConfig[] = [
    { id: "expenses", label: "Траты",     icon: Receipt  },
    { id: "members",  label: "Участники", icon: Users    },
    { id: "balances", label: "Долги",     icon: BarChart2 },
];

interface QuickGroup { emoji: string; name: string }

export const QUICK_GROUPS: QuickGroup[] = [
    { emoji: "✈️", name: "Поездка в Питер" },
    { emoji: "🏠", name: "Квартира" },
    { emoji: "🎉", name: "Корпоратив" },
    { emoji: "🍕", name: "Ужин с друзьями" },
];

export const EMOJIS: string[] = [
    "✈️","🏖️","🏙️","⛷️","🎉","🏠","🍕","🎸",
    "🏕️","🚗","🎂","🍻","🛳️","🎭","🏋️","🌍",
];

export interface SplitTypeOption { id: SplitType; label: string; icon: string; desc: string }

export const SPLIT_TYPES: SplitTypeOption[] = [
    { id: "EQUAL",  label: "Поровну",      icon: "⚖️", desc: "Все платят одинаково" },
    { id: "CUSTOM", label: "По-разному",   icon: "✏️", desc: "Можно задать доли" },
];