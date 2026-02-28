import type {FC} from "react";
import {TABS} from "@/const";
import type {TabId} from "@/types/types.ts";

interface Props {
    activeTab: TabId
    setActiveTab: (tab: TabId) => void
}

export const GroupTabs: FC<Props> = ({activeTab, setActiveTab}) => {

    return <div className="flex gap-1 bg-[#161616] border border-[#242424] rounded-2xl p-1 mb-4">
        {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-[13px] font-semibold transition-all ${active ? "bg-[#242424] text-zinc-100" : "text-zinc-600 hover:text-zinc-400"}`}
                >
                    <Icon size={14}/>{tab.label}
                </button>
            );
        })}
    </div>
}