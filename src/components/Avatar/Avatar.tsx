import type {FC} from "react";
import {avatarColorClass} from "@/utils";


interface AvatarProps {
    name: string;
    size?: string;
    textSize?: string;
}

export const Avatar: FC<AvatarProps> = ({ name, size = "w-7 h-7", textSize = "text-xs" }: AvatarProps) => {
    return (
        <div className={`${size} ${avatarColorClass(name)} ${textSize} rounded-full flex items-center justify-center font-bold text-white shrink-0 border-2 border-[#0f0f0f]`}>
            {name[0].toUpperCase()}
        </div>
    );
}
