import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// ─── API ──────────────────────────────────────────────────────────────────────
// const fetchGroups = () => axios.get("/api/groups").then(r => r.data);

// ─── Mock ─────────────────────────────────────────────────────────────────────
const mockGroups = [
    {
        id: "1",
        name: "Поездка в Питер",
        emoji: "🏙️",
        membersCount: 5,
        totalAmount: 47800,
        myBalance: -3200,
        lastActivity: "2025-02-20T10:00:00Z",
        members: [{ id: "1", name: "Саша" }, { id: "2", name: "Маша" }, { id: "3", name: "Дима" }],
    },
    {
        id: "2",
        name: "Квартира на Ленина",
        emoji: "🏠",
        membersCount: 3,
        totalAmount: 12500,
        myBalance: 1800,
        lastActivity: "2025-02-18T15:30:00Z",
        members: [{ id: "4", name: "Коля" }, { id: "5", name: "Юля" }],
    },
    {
        id: "3",
        name: "Корпоратив февраль",
        emoji: "🎉",
        membersCount: 12,
        totalAmount: 86000,
        myBalance: 0,
        lastActivity: "2025-02-14T20:00:00Z",
        members: [{ id: "6", name: "Антон" }, { id: "7", name: "Лена" }, { id: "8", name: "Игорь" }],
    },
    {
        id: "4",
        name: "Лыжный weekend",
        emoji: "⛷️",
        membersCount: 4,
        totalAmount: 28400,
        myBalance: -650,
        lastActivity: "2025-02-10T09:00:00Z",
        members: [{ id: "9", name: "Вова" }, { id: "10", name: "Катя" }],
    },
];

// ─── Utils ────────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
    "bg-indigo-500", "bg-violet-500", "bg-pink-500", "bg-amber-500",
    "bg-emerald-500", "bg-blue-500", "bg-red-500", "bg-teal-500",
];

function avatarColorClass(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatAmount(amount) {
    return new Intl.NumberFormat("ru-RU", {
        style: "currency", currency: "RUB", maximumFractionDigits: 0,
    }).format(Math.abs(amount));
}

function timeAgo(dateStr) {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (days === 0) return "сегодня";
    if (days === 1) return "вчера";
    if (days < 7) return `${days} дн. назад`;
    return new Date(dateStr).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ name, size = "w-7 h-7", textSize = "text-xs" }) {
    return (
        <div className={`${size} ${avatarColorClass(name)} ${textSize} rounded-full flex items-center justify-center font-bold text-white shrink-0 border-2 border-[#0f0f0f]`}>
            {name[0].toUpperCase()}
        </div>
    );
}

function MemberStack({ members, total }) {
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
        {total} {total === 1 ? "участник" : total < 5 ? "участника" : "участников"}
      </span>
        </div>
    );
}

function BalanceBadge({ amount }) {
    if (amount === 0) return <span className="text-xs text-zinc-600 font-medium">✓ всё ровно</span>;
    const positive = amount > 0;
    return (
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${positive ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"}`}>
      {positive ? "+" : "−"}{formatAmount(amount)}
    </span>
    );
}

function GroupCard({ group, onClick }) {
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

function TotalSummary({ groups }) {
    const totalOwed = groups.reduce((s, g) => g.myBalance < 0 ? s + g.myBalance : s, 0);
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

function EmptyState({ onCreateGroup }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-3">
            <div className="text-5xl">🤝</div>
            <div className="font-bold text-xl text-zinc-200">Нет активных групп</div>
            <div className="text-sm text-zinc-600 max-w-[240px] leading-relaxed">
                Создай группу и скинь ссылку друзьям — они присоединятся одним кликом
            </div>
            <Button onClick={onCreateGroup} className="mt-2 bg-indigo-500 hover:bg-indigo-600 rounded-2xl px-7 font-bold">
                Создать группу
            </Button>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-[#161616] border border-[#242424] rounded-2xl p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-[14px] bg-[#242424]" />
                <div className="flex-1">
                    <div className="h-4 bg-[#242424] rounded-md w-3/4 mb-2" />
                    <div className="h-3 bg-[#242424] rounded-md w-1/3" />
                </div>
            </div>
            <div className="h-3 bg-[#242424] rounded-md w-1/2" />
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
    const navigate = useNavigate();

    // const { data: groups = [], isLoading } = useQuery({ queryKey: ["groups"], queryFn: fetchGroups });
    const groups = mockGroups;
    const isLoading = false;

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
                    onClick={() => navigate("/group/new")}
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
                <EmptyState onCreateGroup={() => navigate("/group/new")} />
            ) : (
                <>
                    <TotalSummary groups={groups} />
                    <div className="flex flex-col gap-2.5">
                        {groups.map(g => (
                            <GroupCard key={g.id} group={g} onClick={(id) => navigate(`/group/${id}`)} />
                        ))}
                    </div>
                    <div className="h-24" />
                </>
            )}

            {/* FAB */}
            {!isLoading && groups.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-6 pt-8 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent pointer-events-none">
                    <Button
                        onClick={() => navigate("/group/new")}
                        className="pointer-events-auto bg-indigo-500 hover:bg-indigo-600 rounded-full px-8 py-3 text-[15px] font-bold shadow-[0_4px_24px_rgba(99,102,241,0.4)]"
                    >
                        + Новая группа
                    </Button>
                </div>
            )}
        </div>
    );
}