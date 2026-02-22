import type {GroupSummary} from "@/types/types.ts";
import {formatAmount, timeAgo} from "@/utils";
import type {FC} from "react";
import {MemberStack} from "@/components/MemberStack/MemberStack.tsx";
import {BalanceBadge} from "@/components/BalanceBadge/BalanceBadge.tsx";


interface GroupCardProps {
    group: GroupSummary;
    onClick: (id: string) => void;
}

export const GroupCard: FC<GroupCardProps> = ({ group, onClick }: GroupCardProps) => {
    return (
        <div
            onClick={() => onClick(group.id)}
            className="bg-[#161616] border border-[#242424] rounded-2xl p-4 cursor-pointer transition-all duration-150 active:scale-[0.98] hover:border-[#333]"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-[14px] bg-[#1e1e1e] flex items-center justify-center text-2xl shrink-0">
                        {group.emoji}
                    </div>
                    <div>
                        <div className="font-bold text-[15px] text-zinc-100 leading-tight">{group.name}</div>
                        <div className="text-[11px] text-zinc-600 mt-0.5">{timeAgo(group.lastActivity)}</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[11px] text-zinc-600 mb-1">итого</div>
                    <div className="font-bold text-[14px] text-zinc-500">{formatAmount(group.totalAmount)}</div>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <MemberStack members={group.members} total={group.membersCount} />
                <BalanceBadge amount={group.myBalance} />
            </div>
        </div>
    );
}