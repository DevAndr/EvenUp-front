import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChevronLeft, Check, Copy, ArrowRight, Sparkles } from "lucide-react";

// ─── API ──────────────────────────────────────────────────────────────────────
// const fetchGroup   = (id) => axios.get(`/api/groups/${id}`).then(r => r.data);
// const markSettled  = (data) => axios.post("/api/settlements", data).then(r => r.data);

// ─── Mock ─────────────────────────────────────────────────────────────────────
const mockGroup = {
    id: "1",
    name: "Поездка в Питер",
    emoji: "🏙️",
    members: [
        { id: "1", name: "Вы",   isYou: true },
        { id: "2", name: "Саша", isYou: false },
        { id: "3", name: "Маша", isYou: false },
        { id: "4", name: "Дима", isYou: false },
        { id: "5", name: "Юля",  isYou: false },
    ],
    expenses: [
        { id: "e1", amount: 18000, paidBy: "1", splitWith: ["1","2","3","4","5"] },
        { id: "e2", amount: 6400,  paidBy: "2", splitWith: ["1","2","3","4","5"] },
        { id: "e3", amount: 1800,  paidBy: "1", splitWith: ["1","2","3","4"] },
        { id: "e4", amount: 3200,  paidBy: "3", splitWith: ["1","2","3","4","5"] },
        { id: "e5", amount: 2500,  paidBy: "4", splitWith: ["1","2","3","4","5"] },
        { id: "e6", amount: 24000, paidBy: "1", splitWith: ["1","2","3","4","5"] },
    ],
};

// ─── Utils ────────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
    "bg-indigo-500","bg-violet-500","bg-pink-500","bg-amber-500",
    "bg-emerald-500","bg-blue-500","bg-red-500","bg-teal-500",
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

// ─── Debt Algorithm ───────────────────────────────────────────────────────────
function calcDebts(members, expenses) {
    const balances = {};
    members.forEach(m => (balances[m.id] = 0));

    expenses.forEach(exp => {
        const per = exp.amount / exp.splitWith.length;
        exp.splitWith.forEach(uid => { balances[uid] -= per; });
        balances[exp.paidBy] += exp.amount;
    });

    const creditors = [], debtors = [];
    Object.entries(balances).forEach(([uid, bal]) => {
        const m = members.find(x => x.id === uid);
        if (bal > 0.01)  creditors.push({ uid, name: m.name, isYou: m.isYou, amount: bal });
        if (bal < -0.01) debtors.push({ uid, name: m.name, isYou: m.isYou, amount: -bal });
    });

    const transactions = [];
    let ci = 0, di = 0;
    const creds = creditors.map(x => ({ ...x }));
    const debts = debtors.map(x => ({ ...x }));

    while (ci < creds.length && di < debts.length) {
        const pay = Math.min(creds[ci].amount, debts[di].amount);
        transactions.push({ id: `${debts[di].uid}-${creds[ci].uid}`, from: debts[di], to: creds[ci], amount: pay });
        creds[ci].amount -= pay;
        debts[di].amount -= pay;
        if (creds[ci].amount < 0.01) ci++;
        if (debts[di].amount < 0.01) di++;
    }

    return { transactions, balances };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ name, isYou, size = "w-10 h-10", text = "text-sm" }) {
    return (
        <div className={`${size} ${text} ${isYou ? "bg-indigo-500" : avatarColorClass(name)} rounded-full flex items-center justify-center font-bold text-white shrink-0`}>
            {isYou ? "Я" : name[0].toUpperCase()}
        </div>
    );
}

function SbpCopySheet({ open, onClose, transaction }) {
    const [copied, setCopied] = useState(false);
    if (!transaction) return null;

    // Mock SBP phone — в реальном приложении берётся из профиля пользователя
    const phone = "+7 (999) 123-45-67";
    const comment = `Долг: ${transaction.from.name} → ${transaction.to.name}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(phone);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="bottom" className="bg-[#161616] border-t border-[#2a2a2a] rounded-t-3xl pb-10">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-zinc-100 text-lg font-bold">Перевод по СБП</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-4">
                    {/* Amount */}
                    <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-4 text-center">
                        <div className="text-[11px] text-zinc-600 uppercase tracking-wider mb-1">Сумма перевода</div>
                        <div className="text-3xl font-extrabold text-zinc-100">{formatAmount(transaction.amount)}</div>
                    </div>

                    {/* Recipient */}
                    <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-4">
                        <div className="text-[11px] text-zinc-600 uppercase tracking-wider mb-3">Получатель</div>
                        <div className="flex items-center gap-3">
                            <Avatar name={transaction.to.name} isYou={transaction.to.isYou} />
                            <div className="flex-1">
                                <div className="font-bold text-zinc-100">{transaction.to.isYou ? "Вы" : transaction.to.name}</div>
                                <div className="text-sm text-zinc-500 mt-0.5">{phone}</div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCopy}
                                className={`w-9 h-9 rounded-xl border transition-all ${
                                    copied
                                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                        : "bg-[#2a2a2a] border-[#333] text-zinc-400 hover:text-zinc-200"
                                }`}
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </Button>
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="bg-[#1e1e1e] border border-[#242424] rounded-2xl p-4">
                        <div className="text-[11px] text-zinc-600 uppercase tracking-wider mb-2">Комментарий</div>
                        <div className="text-sm text-zinc-400 font-medium">{comment}</div>
                    </div>

                    <div className="text-xs text-zinc-700 text-center leading-relaxed">
                        Переведи через приложение банка по номеру телефона через СБП
                    </div>

                    <Button
                        onClick={onClose}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-2xl h-13 font-bold"
                    >
                        Готово
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function ConfirmDialog({ open, onClose, onConfirm, transaction, loading }) {
    if (!transaction) return null;
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-[#161616] border border-[#2a2a2a] rounded-3xl max-w-sm mx-4 p-6">
                <DialogHeader>
                    <DialogTitle className="text-zinc-100 text-lg font-bold">Подтвердить оплату</DialogTitle>
                </DialogHeader>
                <div className="mt-3 flex flex-col gap-4">
                    <div className="bg-[#1e1e1e] rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex flex-col items-center gap-1.5">
                            <Avatar name={transaction.from.name} isYou={transaction.from.isYou} />
                            <span className="text-xs text-zinc-500">{transaction.from.isYou ? "Вы" : transaction.from.name}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <ArrowRight size={18} className="text-zinc-600" />
                            <span className="font-extrabold text-lg text-zinc-100">{formatAmount(transaction.amount)}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                            <Avatar name={transaction.to.name} isYou={transaction.to.isYou} />
                            <span className="text-xs text-zinc-500">{transaction.to.isYou ? "Вам" : transaction.to.name}</span>
                        </div>
                    </div>
                    <p className="text-sm text-zinc-500 text-center leading-relaxed">
                        Отметить этот перевод как выполненный? Долг будет закрыт для всех участников группы.
                    </p>
                    <div className="flex gap-2.5">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1 rounded-2xl bg-[#1e1e1e] text-zinc-400 hover:text-zinc-200 hover:bg-[#242424] border border-[#2a2a2a]"
                        >
                            Отмена
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-bold disabled:opacity-50"
                        >
                            {loading ? "..." : <><Check size={16} className="mr-1.5" />Оплачено</>}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function TransactionCard({ transaction, settled, onSettle, onSbp }) {
    const youDebtor   = transaction.from.isYou;
    const youCreditor = transaction.to.isYou;
    const youInvolved = youDebtor || youCreditor;

    return (
        <div className={`rounded-2xl border p-4 transition-all ${
            settled
                ? "bg-[#141414] border-[#1e1e1e] opacity-50"
                : youInvolved
                    ? "bg-indigo-500/[0.06] border-indigo-500/20"
                    : "bg-[#161616] border-[#242424]"
        }`}>
            {/* Avatars row */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col items-center gap-1.5">
                    <Avatar name={transaction.from.name} isYou={transaction.from.isYou} size="w-12 h-12" text="text-base" />
                    <span className="text-xs text-zinc-500 font-medium">
            {transaction.from.isYou ? "Вы" : transaction.from.name}
          </span>
                    <span className="text-[10px] text-zinc-700">должен</span>
                </div>

                <div className="flex flex-col items-center gap-1 flex-1 px-3">
                    <div className={`font-extrabold text-xl ${
                        settled ? "text-zinc-600" :
                            youInvolved ? "text-indigo-400" : "text-zinc-300"
                    }`}>
                        {formatAmount(transaction.amount)}
                    </div>
                    <div className="flex items-center gap-1 w-full">
                        <div className="flex-1 h-px bg-[#2a2a2a]" />
                        <ArrowRight size={14} className="text-zinc-700 shrink-0" />
                        <div className="flex-1 h-px bg-[#2a2a2a]" />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1.5">
                    <Avatar name={transaction.to.name} isYou={transaction.to.isYou} size="w-12 h-12" text="text-base" />
                    <span className="text-xs text-zinc-500 font-medium">
            {transaction.to.isYou ? "Вам" : transaction.to.name}
          </span>
                    <span className="text-[10px] text-zinc-700">получает</span>
                </div>
            </div>

            {/* Actions */}
            {settled ? (
                <div className="flex items-center justify-center gap-2 py-1">
                    <Check size={14} className="text-emerald-500" />
                    <span className="text-xs text-emerald-600 font-semibold">Оплачено</span>
                </div>
            ) : (
                <div className="flex gap-2">
                    {youDebtor && (
                        <Button
                            onClick={() => onSbp(transaction)}
                            variant="ghost"
                            className="flex-1 rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] text-zinc-400 hover:text-zinc-200 hover:bg-[#242424] text-[13px] font-semibold h-10"
                        >
                            СБП
                        </Button>
                    )}
                    <Button
                        onClick={() => onSettle(transaction)}
                        className={`rounded-xl text-[13px] font-bold h-10 transition-all ${
                            youInvolved
                                ? "flex-1 bg-indigo-500 hover:bg-indigo-600 shadow-[0_2px_12px_rgba(99,102,241,0.3)]"
                                : "flex-1 bg-[#1e1e1e] border border-[#2a2a2a] text-zinc-400 hover:text-zinc-200 hover:bg-[#242424]"
                        }`}
                    >
                        <Check size={14} className="mr-1.5" />
                        {youDebtor ? "Я перевёл" : youCreditor ? "Получено" : "Отметить"}
                    </Button>
                </div>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettlePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // const { data: group } = useQuery({ queryKey: ["group", id], queryFn: () => fetchGroup(id) });
    const group = mockGroup;

    const { transactions, balances } = calcDebts(group.members, group.expenses);

    const [settled, setSettled]           = useState(new Set());
    const [confirmTx, setConfirmTx]       = useState(null);
    const [sbpTx, setSbpTx]               = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const myBalance = balances["1"] || 0;
    const pendingCount = transactions.filter(t => !settled.has(t.id)).length;
    const allDone = pendingCount === 0;

    const handleSettle = (tx) => setConfirmTx(tx);

    const handleConfirm = () => {
        setConfirmLoading(true);
        // await markSettled({ groupId: id, ...confirmTx });
        setTimeout(() => {
            setSettled(prev => new Set([...prev, confirmTx.id]));
            setConfirmTx(null);
            setConfirmLoading(false);
        }, 600);
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] max-w-[480px] mx-auto font-[Manrope,sans-serif] px-4 pt-4 pb-10">
            <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.25s ease forwards; }
      `}</style>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pt-1">
                <Button
                    variant="ghost" size="icon"
                    onClick={() => navigate(-1)}
                    className="w-9 h-9 rounded-[12px] bg-[#1a1a1a] border border-[#2a2a2a] text-zinc-400 hover:text-zinc-100 hover:bg-[#242424] shrink-0"
                >
                    <ChevronLeft size={20} />
                </Button>
                <div className="flex-1 min-w-0">
                    <h1 className="text-[18px] font-extrabold text-zinc-100 tracking-tight truncate">Кто кому должен</h1>
                    <p className="text-xs text-zinc-600 mt-0.5">{group.emoji} {group.name}</p>
                </div>
            </div>

            {/* My balance banner */}
            {myBalance !== 0 && (
                <div className={`rounded-2xl p-4 mb-5 border ${
                    myBalance > 0
                        ? "bg-emerald-400/[0.07] border-emerald-400/20"
                        : "bg-red-400/[0.07] border-red-400/20"
                }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className={`text-[11px] font-semibold uppercase tracking-wider mb-1 ${myBalance > 0 ? "text-emerald-500" : "text-red-500"}`}>
                                {myBalance > 0 ? "Вам должны" : "Вы должны"}
                            </div>
                            <div className={`text-2xl font-extrabold ${myBalance > 0 ? "text-emerald-400" : "text-red-400"}`}>
                                {formatAmount(myBalance)}
                            </div>
                        </div>
                        {myBalance > 0 ? (
                            <div className="text-3xl">💰</div>
                        ) : (
                            <div className="text-3xl">💸</div>
                        )}
                    </div>
                </div>
            )}

            {/* All done state */}
            {allDone ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 fade-up text-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <Sparkles size={32} className="text-emerald-400" />
                    </div>
                    <div className="font-extrabold text-xl text-zinc-100">Все квиты!</div>
                    <div className="text-sm text-zinc-600 max-w-[220px] leading-relaxed">
                        Все переводы выполнены. Группа закрыта.
                    </div>
                    <Button
                        onClick={() => navigate(-1)}
                        className="mt-2 bg-[#1e1e1e] border border-[#2a2a2a] text-zinc-400 hover:text-zinc-200 hover:bg-[#242424] rounded-2xl px-6"
                    >
                        Вернуться к группе
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col gap-3 fade-up">
                    {/* Counter */}
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-zinc-600">
                            {pendingCount} {pendingCount === 1 ? "перевод" : pendingCount < 5 ? "перевода" : "переводов"} осталось
                        </p>
                        <div className="flex gap-1">
                            {transactions.map(t => (
                                <div
                                    key={t.id}
                                    className={`h-1.5 w-6 rounded-full transition-all duration-300 ${settled.has(t.id) ? "bg-emerald-500" : "bg-[#2a2a2a]"}`}
                                />
                            ))}
                        </div>
                    </div>

                    {transactions.map(tx => (
                        <TransactionCard
                            key={tx.id}
                            transaction={tx}
                            settled={settled.has(tx.id)}
                            onSettle={handleSettle}
                            onSbp={setSbpTx}
                        />
                    ))}
                </div>
            )}

            {/* Dialogs */}
            <ConfirmDialog
                open={!!confirmTx}
                onClose={() => setConfirmTx(null)}
                onConfirm={handleConfirm}
                transaction={confirmTx}
                loading={confirmLoading}
            />

            <SbpCopySheet
                open={!!sbpTx}
                onClose={() => setSbpTx(null)}
                transaction={sbpTx}
            />
        </div>
    );
}