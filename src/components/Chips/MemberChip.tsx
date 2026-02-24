import type {FC} from "react";
import {avatarColorClass} from "@/utils";
import {X} from "lucide-react";


interface MemberChipProps { name: string; onRemove: (name: string) => void; isYou?: boolean }

export const MemberChip: FC<MemberChipProps> = ({ name, onRemove, isYou = false }: MemberChipProps)  => {
    return (
        <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full pl-1.5 pr-2.5 py-1.5 animate-in fade-in zoom-in-90 duration-200">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${isYou ? "bg-indigo-500" : avatarColorClass(name)}`}>
                {isYou ? "Я" : name[0].toUpperCase()}
            </div>
            <span className="text-[13px] font-semibold text-zinc-300 max-w-[90px] truncate">
        {isYou ? "Вы" : name}
      </span>
            {!isYou && (
                <button onClick={() => onRemove(name)} className="text-zinc-600 hover:text-zinc-400 transition-colors">
                    <X size={14} />
                </button>
            )}
        </div>
    );
}