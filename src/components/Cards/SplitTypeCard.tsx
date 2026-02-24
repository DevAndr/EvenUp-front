import type {SplitType} from "@/types/types.ts";
import type {FC} from "react";
import type {SplitTypeOption} from "@/const";



interface SplitTypeCardProps { type: SplitTypeOption; selected: boolean; onClick: (id: SplitType) => void }

export const SplitTypeCard: FC<SplitTypeCardProps> = ({ type, selected, onClick }) => {
    return (
        <button
            onClick={() => onClick(type.id)}
            className={`flex-1 rounded-2xl p-3 text-left transition-all border ${
                selected
                    ? "bg-indigo-500/10 border-indigo-500/40"
                    : "bg-[#1a1a1a] border-[#242424] hover:border-zinc-700"
            }`}
        >
            <div className="text-xl mb-1">{type.icon}</div>
            <div className={`font-bold text-sm ${selected ? "text-indigo-300" : "text-zinc-300"}`}>{type.label}</div>
            <div className="text-[11px] text-zinc-600 mt-0.5">{type.desc}</div>
        </button>
    );
}