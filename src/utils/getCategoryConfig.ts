import type {CategoryId} from "@/types/types.ts";
import {CATEGORIES, type CategoryConfig} from "@/const";

export function getCategoryConfig(id: CategoryId): CategoryConfig {
    return CATEGORIES.find(c => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}