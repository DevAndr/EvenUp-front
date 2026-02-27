import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {GroupCard} from "@/components/GroupCard/GroupCard.tsx";
import {EmptyState} from "@/components/Empty/EmptyStateGroups.tsx";
import {TotalSummary} from "@/components/TotalSummary/TotalSummary.tsx";
import {SkeletonCard} from "@/components/Skeleton/SkeletonCard.tsx";
import {useGetGroups} from "@/api/groups/useGetGroups.ts";

export default function HomePage() {
    const navigate = useNavigate();
    const { data: groups = [], isLoading } = useGetGroups();

    const handleGroupClick = (id: string) => navigate(`/app/group/${id}`);
    const handleCreate = () => navigate("/app/group/new");

    return (
        <div className="min-h-screen bg-[#0f0f0f] px-4 pt-4 pb-0 max-w-[480px] mx-auto font-[Manrope,sans-serif]">

            {/* Header */}
            <div className="flex items-center justify-between mb-6 pt-1">
                <div>
                    <h1 className="text-[28px] font-extrabold text-zinc-100 tracking-tight">Скинемся</h1>
                    <p className="text-[13px] text-zinc-600 mt-0.5">
                        {isLoading ? "" : groups.length > 0
                            ? `${groups.length} ${groups.length < 5 ? "группы" : "групп"}`
                            : "делим честно"}
                    </p>
                </div>
                <Button
                    onClick={handleCreate}
                    size="icon"
                    className="w-10 h-10 rounded-[14px] bg-[#1e1e1e] border border-[#2a2a2a] hover:bg-[#252525] text-zinc-100"
                >
                    <Plus size={20} />
                </Button>
            </div>

            {isLoading ? (
                <div className="flex flex-col gap-2.5">
                    {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : groups.length === 0 ? (
                <EmptyState onCreateGroup={handleCreate} />
            ) : (
                <>
                    <TotalSummary groups={groups} />
                    <div className="flex flex-col gap-2.5">
                        {groups.map(g => (
                            <GroupCard key={g.id} group={g} onClick={handleGroupClick} />
                        ))}
                    </div>
                    <div className="h-24" />
                </>
            )}

            {/* FAB */}
            {!isLoading && groups.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-6 pt-8 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent pointer-events-none">
                    <Button
                        onClick={handleCreate}
                        className="pointer-events-auto bg-indigo-500 hover:bg-indigo-600 rounded-full px-8 py-3 text-[15px] font-bold shadow-[0_4px_24px_rgba(99,102,241,0.4)]"
                    >
                        + Новая группа
                    </Button>
                </div>
            )}
        </div>
    );
}