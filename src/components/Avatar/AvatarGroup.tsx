import {avatarColorClass} from "@/utils";
import type {FC} from "react";

interface AvatarGroupProps {
    name: string;
    isYou?: boolean;
    size?: string;
    text?: string;
}

export const AvatarGroup: FC<AvatarGroupProps> = ({ name, isYou = false, size = "w-8 h-8", text = "text-sm" }: AvatarGroupProps) => {
    return (
        <div className={`${size} ${text} ${isYou ? "bg-indigo-500" : avatarColorClass(name)} rounded-full flex items-center justify-center font-bold text-white shrink-0`}>
            {isYou ? "Я" : name[0].toUpperCase()}
        </div>
    );
}