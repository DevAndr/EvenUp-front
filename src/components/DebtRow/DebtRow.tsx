import {type FC} from "react";
import type { Transaction} from "@/types/types.ts";
import {AvatarGroup} from "@/components/Avatar/AvatarGroup.tsx";
import {formatAmount} from "@/utils";

interface DebtRowProps { transaction: Transaction }
export const DebtRow: FC<DebtRowProps> = ({ transaction }: DebtRowProps) => {
    const youDebtor   = transaction.from.isYou;
    const youCreditor = transaction.to.isYou;
    const highlighted = youDebtor || youCreditor;
    return (
        <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 border ${highlighted ? "bg-indigo-500/[0.07] border-indigo-500/20" : "bg-[#161616] border-[#242424]"}`}>
            <div className="flex items-center gap-2 flex-1 min-w-0">
                <AvatarGroup name={transaction.from.name} isYou={transaction.from.isYou} />
                <div>
                    <div className="text-[13px] font-semibold text-zinc-200 truncate">
                        {transaction.from.isYou ? "Вы" : transaction.from.name}
                    </div>
                    <div className="text-[11px] text-zinc-600">должен</div>
                </div>
            </div>
            <div className="text-center px-2">
                <div className={`font-extrabold text-[15px] ${highlighted ? "text-indigo-400" : "text-zinc-400"}`}>
                    {formatAmount(transaction.amount)}
                </div>
                <div className="text-[10px] text-zinc-700 mt-0.5">→</div>
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                <div className="text-right">
                    <div className="text-[13px] font-semibold text-zinc-200 truncate">
                        {transaction.to.isYou ? "Вам" : transaction.to.name}
                    </div>
                    <div className="text-[11px] text-zinc-600">получает</div>
                </div>
                <AvatarGroup name={transaction.to.name} isYou={transaction.to.isYou} />
            </div>
        </div>
    );
}