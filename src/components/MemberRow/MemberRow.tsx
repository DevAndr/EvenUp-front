import type {Member, Transaction} from "@/types/types.ts";
import type {FC} from "react";
import {AvatarGroup} from "@/components/Avatar/AvatarGroup.tsx";
import {formatAmount} from "@/utils";

interface MemberRowProps { member: Member; balance: number }
export const MemberRow: FC<MemberRowProps> = ({ member, balance }: MemberRowProps) =>  {
    const positive = balance > 0.01;
    const negative = balance < -0.01;
    return (
        <div className="flex items-center gap-3 bg-[#161616] border border-[#242424] rounded-2xl px-4 py-3">
            <AvatarGroup name={member.name} isYou={member.isYou} />
            <div className="flex-1">
                <div className="font-semibold text-[14px] text-zinc-100">{member.isYou ? "Вы" : member.name}</div>
                <div className="text-xs text-zinc-600 mt-0.5">
                    {positive ? "получает" : negative ? "должен" : "всё ровно"}
                </div>
            </div>
            <div className={`font-bold text-[14px] ${positive ? "text-emerald-400" : negative ? "text-red-400" : "text-zinc-600"}`}>
                {positive ? "+" : negative ? "−" : ""}{balance !== 0 ? formatAmount(balance) : "0 ₽"}
            </div>
        </div>
    );
}