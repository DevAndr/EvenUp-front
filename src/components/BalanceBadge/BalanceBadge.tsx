import type {FC} from "react";
import {formatAmount} from "@/utils";

interface BalanceBadgeProps {
    amount: number;
}

export const BalanceBadge: FC<BalanceBadgeProps> = ({ amount }) => {
    if (amount === 0) return <span className="text-xs text-zinc-600 font-medium">✓ всё ровно</span>;
    const positive = amount > 0;

    return (
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${positive ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"}`}>
      {positive ? "+" : "−"}{formatAmount(amount)}
    </span>
    );
}