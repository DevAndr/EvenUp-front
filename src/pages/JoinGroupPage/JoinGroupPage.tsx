import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type {ApiGroup, ApiGroupMember} from "@/types/types.ts";
import {CURRENT_USER_ID} from "@/pages/GroupPage/GroupPage.tsx";
import {avatarColorClass, formatAmount, pluralMembers} from "@/utils";
import {Spinner} from "@/components/ui/spinner.tsx";

type PageStatus = "loading" | "preview" | "joining" | "already" | "success" | "error";

// ─── Mock ─────────────────────────────────────────────────────────────────────
const mockGroup: ApiGroup = {
    id: "cmm0blr9h000uqt399w2oywok",
    name: "Квартира", emoji: "🏠",
    description: "Совместная аренда",
    splitType: "CUSTOM", status: "ACTIVE",
    createdAt: "2026-02-24T08:05:12.389Z",
    updatedAt: "2026-02-24T08:05:12.389Z",
    ownerId: "cmm0blr8v0000qt39oiujeac4",
    owner: { id: "cmm0blr8v0000qt39oiujeac41", name: "Alice Ivanova", username: "alice_iv" },
    members: [
        { id: "m1", joinedAt: "2026-02-24T08:05:12.389Z", groupId: "cmm0blr9h000uqt399w2oywok",
            userId: "cmm0blr8v0000qt39oiujeac41",
            user: { id: "cmm0blr8v0000qt39oiujeac4", name: "Alice Ivanova", username: "alice_iv", avatarUrl: null } },
        { id: "m2", joinedAt: "2026-02-24T08:05:12.389Z", groupId: "cmm0blr9h000uqt399w2oywok",
            userId: "cmm0blr8y0001qt39dg7enh4v",
            user: { id: "cmm0blr8y0001qt39dg7enh4v", name: "Bob Petrov", username: "bob_p", avatarUrl: null } },
        { id: "m3", joinedAt: "2026-02-24T08:05:12.389Z", groupId: "cmm0blr9h000uqt399w2oywok",
            userId: "cmm0blr910003qt399a417ufh",
            user: { id: "cmm0blr910003qt399a417ufh", name: "Diana Kozlova", username: "diana_k", avatarUrl: null } },
    ],
    expenses: [],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface MemberRowProps { member: ApiGroupMember; isOwner: boolean }
function MemberRow({ member, isOwner }: MemberRowProps) {
    return (
        <div className="flex items-center gap-3">
            <Avatar name={member.user.name} />
            <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold text-zinc-200 truncate">{member.user.name}</div>
                {member.user.username && (
                    <div className="text-[11px] text-zinc-600">@{member.user.username}</div>
                )}
            </div>
            {isOwner && (
                <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2 py-0.5">
          создатель
        </span>
            )}
        </div>
    );
}

interface AvatarProps { name: string; size?: string; text?: string }
function Avatar({ name, size = "w-9 h-9", text = "text-sm" }: AvatarProps) {
    return (
        <div className={`${size} ${text} ${avatarColorClass(name)} rounded-full flex items-center justify-center font-bold text-white shrink-0`}>
            {name[0].toUpperCase()}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JoinGroupPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [status, setStatus] = useState<PageStatus>("loading");
    const [errorMsg, setErrorMsg] = useState<string>("");

    // const { data: group, isLoading, isError } = useQuery<ApiGroup>({
    //   queryKey: ["group-preview", id],
    //   queryFn: () => api.get(`/groups/${id}/preview`).then(r => r.data),
    // });
    const group: ApiGroup = mockGroup;
    const isLoading = false;
    const isError = false;

    // const joinMutation = useMutation({
    //   mutationFn: () => api.post(`/groups/${id}/join`),
    //   onSuccess: () => { setStatus("success"); setTimeout(() => navigate(`/app/group/${id}`), 800); },
    //   onError: (err: any) => { setStatus("error"); setErrorMsg(err?.response?.data?.message ?? "Не удалось вступить"); },
    // });

    useEffect(() => {
        if (isLoading) return;
        if (isError) { setStatus("error"); setErrorMsg("Группа не найдена или ссылка недействительна"); return; }
        if (!group) return;

        const alreadyMember = group.members.some(m => m.userId === CURRENT_USER_ID);
        if (alreadyMember) {
            setStatus("already");
            setTimeout(() => navigate(`/app/group/${id}`), 1200);
        } else {
            setStatus("preview");
        }
    }, [group, isLoading, isError, id, navigate]);

    const handleJoin = (): void => {
        setStatus("joining");
        // joinMutation.mutate();
        // Мок:
        setTimeout(() => {
            setStatus("success");
            setTimeout(() => navigate(`/app/group/${id}`), 800);
        }, 700);
    };

    const totalExpenses = group?.expenses.reduce((s, e) => s + Number(e.amount), 0) ?? 0;

    // ── Loading ──
    if (status === "loading") {
        return (
            <div className="min-h-screen w-full bg-[#0f0f0f] flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    // ── Already member ──
    if (status === "already") {
        return (
            <div className="min-h-screen w-full bg-[#0f0f0f] flex flex-col items-center justify-center gap-3 px-6 font-[Manrope,sans-serif]">
                <div className="text-4xl">👋</div>
                <div className="font-bold text-lg text-zinc-100">Ты уже в группе</div>
                <div className="text-sm text-zinc-600">Переходим...</div>
            </div>
        );
    }

    // ── Success ──
    if (status === "success") {
        return (
            <div className="min-h-screen w-full bg-[#0f0f0f] flex flex-col items-center justify-center gap-3 px-6 font-[Manrope,sans-serif]">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl">
                    ✅
                </div>
                <div className="font-bold text-lg text-zinc-100">Ты в группе!</div>
                <div className="text-sm text-zinc-600">Переходим к группе...</div>
            </div>
        );
    }

    // ── Error ──
    if (status === "error") {
        return (
            <div className="min-h-screen w-full bg-[#0f0f0f] flex flex-col items-center justify-center gap-4 px-6 font-[Manrope,sans-serif]">
                <div className="text-4xl">😕</div>
                <div className="font-bold text-lg text-zinc-100">Что-то пошло не так</div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 text-center max-w-[280px]">
                    <p className="text-sm text-red-400 leading-relaxed">{errorMsg}</p>
                </div>
                <button onClick={() => navigate("/")}
                        className="text-sm text-zinc-500 underline underline-offset-4">
                    На главную
                </button>
            </div>
        );
    }

    // ── Preview ──
    return (
        <div className="min-h-screen w-full bg-[#0f0f0f] font-[Manrope,sans-serif] pt-safe pb-safe flex flex-col">
            <div className="flex-1 px-4 pt-6 pb-4 flex flex-col gap-5">

                {/* Group card */}
                <div className="bg-[#161616] border border-[#242424] rounded-2xl p-5">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-[18px] bg-[#1e1e1e] flex items-center justify-center text-3xl shrink-0">
                            {group.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-[20px] font-extrabold text-zinc-100 tracking-tight truncate">{group.name}</h1>
                            {group.description && (
                                <p className="text-[13px] text-zinc-500 mt-0.5 truncate">{group.description}</p>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-2">
                        <div className="flex-1 bg-[#1a1a1a] rounded-xl px-3 py-2.5 text-center">
                            <div className="text-[11px] text-zinc-600 mb-0.5">участников</div>
                            <div className="font-extrabold text-[16px] text-zinc-200">{group.members.length}</div>
                        </div>
                        {totalExpenses > 0 && (
                            <div className="flex-1 bg-[#1a1a1a] rounded-xl px-3 py-2.5 text-center">
                                <div className="text-[11px] text-zinc-600 mb-0.5">общие траты</div>
                                <div className="font-extrabold text-[16px] text-zinc-200">{formatAmount(totalExpenses)}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Inviter */}
                <div className="flex items-center gap-2 text-[13px] text-zinc-500">
                    <Avatar name={group.owner.name} size="w-6 h-6" text="text-[10px]" />
                    <span><span className="text-zinc-300 font-semibold">{group.owner.name}</span> приглашает тебя</span>
                </div>

                {/* Members */}
                <div className="bg-[#161616] border border-[#242424] rounded-2xl p-4">
                    <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-3">
                        {group.members.length} {pluralMembers(group.members.length)} в группе
                    </p>
                    <div className="flex flex-col gap-3">
                        {group.members.map(m => (
                            <MemberRow key={m.id} member={m} isOwner={m.userId === group.ownerId} />
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="px-4 pb-6 pt-4 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/95 to-transparent">
                <button
                    onClick={handleJoin}
                    disabled={status === "joining"}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 active:scale-[0.98] disabled:opacity-60 transition-all rounded-2xl h-14 text-[16px] font-bold text-white shadow-[0_4px_24px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2"
                >
                    {status === "joining"
                        ? <><Spinner /><span>Вступаем...</span></>
                        : `Вступить в «${group.name}»`
                    }
                </button>
                <p className="text-center text-[11px] text-zinc-700 mt-3">
                    Ты увидишь все траты и сможешь добавлять свои
                </p>
            </div>
        </div>
    );
}