import type {GroupSummary} from "@/types/types.ts";
import type {FC} from "react";
import {pluralMembers} from "@/utils";
import {Avatar} from "@/components/Avatar/Avatar.tsx";

interface MemberStackProps {
    members: GroupSummary["members"];
    total: number;
}

export const MemberStack: FC<MemberStackProps> = ({ members, total }: MemberStackProps) => {
    const visible = members.slice(0, 3);
    const rest = total - visible.length;
    return (
        <div className="flex items-center">
            {visible.map((m, i) => (
                <div key={m.id} className={i > 0 ? "-ml-2" : ""} style={{ zIndex: visible.length - i }}>
                    <Avatar name={m.name} />
                </div>
            ))}
            {rest > 0 && (
                <div className="-ml-2 w-6 h-6 rounded-full bg-[#2a2a2a] border-2 border-[#0f0f0f] flex items-center justify-center text-[9px] text-zinc-500 font-semibold">
                    +{rest}
                </div>
            )}
            <span className="ml-2 text-xs text-zinc-600">
        {total} {pluralMembers(total)}
      </span>
        </div>
    );
}