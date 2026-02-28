import type {CategoryId} from "@/types/types.ts";
import type {FC} from "react";
import {getCategoryConfig} from "@/utils";

interface CategoryIconProps { categoryId: CategoryId }

export const CategoryIcon: FC< CategoryIconProps> = ({ categoryId }: CategoryIconProps) => {
    const cat = getCategoryConfig(categoryId);
    const Icon = cat.icon;

    return (
        <div className={`w-10 h-10 rounded-2xl ${cat.bg} flex items-center justify-center shrink-0`}>
            <Icon size={18} className={cat.color} />
        </div>
    );
}
