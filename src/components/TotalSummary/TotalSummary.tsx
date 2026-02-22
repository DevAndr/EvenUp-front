import type {GroupSummary} from "@/types/types.ts";
import type {FC} from "react";
import {formatAmount} from "@/utils";

interface TotalSummaryProps {
    groups: GroupSummary[];
}

export const TotalSummary: FC<TotalSummaryProps> = ({ groups }: TotalSummaryProps) => {
    const totalOwed  = groups.reduce((s, g) => g.myBalance < 0 ? s + g.myBalance : s, 0);
    const totalOwing = groups.reduce((s, g) => g.myBalance > 0 ? s + g.myBalance : s, 0);
    if (!totalOwed && !totalOwing) return null;
    return (
        <div className="flex gap-2.5 mb-5">
            {totalOwing > 0 && (
                <div className="flex-1 bg-emerald-400/[0.07] border border-emerald-400/15 rounded-2xl p-3">
                    <div className="text-[11px] text-emerald-400 mb-1">тебе должны</div>
                    <div className="font-extrabold text-lg text-emerald-400">{formatAmount(totalOwing)}</div>
                </div>
            )}
            {totalOwed < 0 && (
                <div className="flex-1 bg-red-400/[0.07] border border-red-400/15 rounded-2xl p-3">
                    <div className="text-[11px] text-red-400 mb-1">ты должен</div>
                    <div className="font-extrabold text-lg text-red-400">{formatAmount(totalOwed)}</div>
                </div>
            )}
        </div>
    );
}
