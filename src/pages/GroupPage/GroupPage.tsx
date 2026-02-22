import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    ChevronLeft, Plus, Receipt, Users, BarChart2,
    Utensils, Car, ShoppingCart, Home, Music, Plane, MoreHorizontal, Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type {
    Group, Member, Expense, CategoryId, TabId, DebtResult, BalanceMap, Transaction,
} from "@/types/types.ts";

// ─── API ──────────────────────────────────────────────────────────────────────
// const fetchGroup = (id: string): Promise<Group> =>
//   axios.get(`/api/groups/${id}`).then(r => r.data);

// ─── Mock ─────────────────────────────────────────────────────────────────────
const mockGroup: Group = {
    id: "1", name: "Поездка в Питер", emoji: "🏙️",
    splitType: "equal", status: "active", createdAt: "2025-02-18T08:00:00Z",
    members: [
        { id: "1", name: "Вы",   isYou: true },
        { id: "2", name: "Саша", isYou: false },
        { id: "3", name: "Маша", isYou: false },
        { id: "4", name: "Дима", isYou: false },
        { id: "5", name: "Юля",  isYou: false },
    ],
    expenses: [
        { id: "e1", description: "Отель на 3 ночи",    amount: 18000, paidBy: "1", category: "home",    date: "2025-02-20T10:00:00Z", splitWith: ["1","2","3","4","5"] },
        { id: "e2", description: "Ужин в ресторане",   amount: 6400,  paidBy: "2", category: "food",    date: "2025-02-20T20:00:00Z", splitWith: ["1","2","3","4","5"] },
        { id: "e3", description: "Такси из аэропорта", amount: 1800,  paidBy: "1", category: "taxi",    date: "2025-02-19T14:00:00Z", splitWith: ["1","2","3","4"] },
        { id: "e4", description: "Продукты в магазине",amount: 3200,  paidBy: "3", category: "grocery", date: "2025-02-21T11:00:00Z", splitWith: ["1","2","3","4","5"] },
        { id: "e5", description: "Музей Эрмитаж",      amount: 2500,  paidBy: "4", category: "music",   date: "2025-02-21T15:00:00Z", splitWith: ["1","2","3","4","5"] },
        { id: "e6", description: "Авиабилеты",          amount: 24000, paidBy: "1", category: "plane",   date: "2025-02-18T08:00:00Z", splitWith: ["1","2","3","4","5"] },
    ],
};

// ─── Constants ────────────────────────────────────────────────────────────────
interface CategoryConfig {
    icon: LucideIcon;
    id: CategoryId;
    label: string;
    color: string;
    bg: string;
}

const CATEGORIES: CategoryConfig[] = [
    { id: "food",    label: "Еда",       icon: Utensils,     color: "text-orange-400",  bg: "bg-orange-400/10" },
    { id: "taxi",    label: "Такси",     icon: Car,          color: "text-blue-400",    bg: "bg-blue-400/10" },
    { id: "grocery", label: "Продукты",  icon: ShoppingCart, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { id: "home",    label: "Жильё",     icon: Home,         color: "text-violet-400",  bg: "bg-violet-400/10" },
    { id: "music",   label: "Досуг",     icon: Music,        color: "text-pink-400",    bg: "bg-pink-400/10" },
    { id: "plane",   label: "Транспорт", icon: Plane,        color: "text-indigo-400",  bg: "bg-indigo-400/10" },
    { id: "other",   label: "Другое",    icon: MoreHorizontal, color: "text-zinc-400",  bg: "bg-zinc-400/10" },
];

interface TabConfig { id: TabId; label: string; icon: LucideIcon }
const TABS: TabConfig[] = [
    { id: "expenses", label: "Траты",     icon: Receipt  },
    { id: "members",  label: "Участники", icon: Users    },
    { id: "balances", label: "Долги",     icon: BarChart2 },
];

// ─── Utils ────────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
    "bg-indigo-500","bg-violet-500","bg-pink-500","bg-amber-500",
    "bg-emerald-500","bg-blue-500","bg-red-500","bg-teal-500",
] as const;

function avatarColorClass(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatAmount(amount: number): string {
    return new Intl.NumberFormat("ru-RU", {
        style: "currency", currency: "RUB", maximumFractionDigits: 0,
    }).format(Math.abs(amount));
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

function getCategoryConfig(id: CategoryId): CategoryConfig {
    return CATEGORIES.find(c => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}

// ─── Debt Algorithm ───────────────────────────────────────────────────────────
function calcDebts(members: Member[], expenses: Expense[]): DebtResult {
    const balances: BalanceMap = {};
    members.forEach(m => (balances[m.id] = 0));

    expenses.forEach(exp => {
        const per = exp.amount / exp.splitWith.length;
        exp.splitWith.forEach(uid => { balances[uid] -= per; });
        balances[exp.paidBy] += exp.amount;
    });

    const creditors: Array<{ uid: string; name: string; isYou: boolean; amount: number }> = [];
    const debtors:   Array<{ uid: string; name: string; isYou: boolean; amount: number }> = [];

    Object.entries(balances).forEach(([uid, bal]) => {
        const m = members.find(x => x.id === uid)!;
        if (bal >  0.01) creditors.push({ uid, name: m.name, isYou: m.isYou, amount: bal });
        if (bal < -0.01) debtors.push(  { uid, name: m.name, isYou: m.isYou, amount: -bal });
    });

    const transactions: Transaction[] = [];
    const creds = creditors.map(x => ({ ...x }));
    const debts = debtors.map(x => ({ ...x }));
    let ci = 0, di = 0;

    while (ci < creds.length && di < debts.length) {
        const pay = Math.min(creds[ci].amount, debts[di].amount);
        transactions.push({
            id: `${debts[di].uid}-${creds[ci].uid}`,
            from: { ...debts[di] },
            to:   { ...creds[ci] },
            amount: pay,
        });
        creds[ci].amount -= pay;
        debts[di].amount -= pay;
        if (creds[ci].amount < 0.01) ci++;
        if (debts[di].amount < 0.01) di++;
    }

    return { transactions, balances };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface AvatarProps {
    name: string;
    isYou?: boolean;
    size?: string;
    text?: string;
}

function Avatar({ name, isYou = false, size = "w-8 h-8", text = "text-sm" }: AvatarProps) {
    return (
        <div className={`${size} ${text} ${isYou ? "bg-indigo-500" : avatarColorClass(name)} rounded-full flex items-center justify-center font-bold text-white shrink-0`}>
            {isYou ? "Я" : name[0].toUpperCase()}
        </div>
    );
}

interface CategoryIconProps { categoryId: CategoryId }
function CategoryIcon({ categoryId }: CategoryIconProps) {
    const cat = getCategoryConfig(categoryId);
    const Icon = cat.icon;
    return (
        <div className={`w-10 h-10 rounded-2xl ${cat.bg} flex items-center justify-center shrink-0`}>
            <Icon size={18} className={cat.color} />
        </div>
    );
}

interface ExpenseCardProps {
    expense: Expense;
    members: Member[];
    onPress: (expense: Expense) => void;
}

function ExpenseCard({ expense, members, onPress }: ExpenseCardProps) {
    const payer = members.find(m => m.id === expense.paidBy);
    const perPerson = expense.amount / expense.splitWith.length;
    const youInvolved = expense.splitWith.includes("1");
    const youPaid = expense.paidBy === "1";

    return (
        <div
            onClick={() => onPress(expense)}
            className="flex items-center gap-3 bg-[#161616] border border-[#242424] rounded-2xl px-4 py-3.5 cursor-pointer hover:border-[#333] active:scale-[0.98] transition-all"
        >
            <CategoryIcon categoryId={expense.category} />
            <div className="flex-1 min-w-0">
                <div className="font-semibold text-[14px] text-zinc-100 truncate">{expense.description}</div>
                <div className="text-[12px] text-zinc-600 mt-0.5">
                    {youPaid ? "Вы заплатили" : `${payer?.name} заплатил`} · {formatDate(expense.date)}
                </div>
            </div>
            <div className="text-right shrink-0">
                <div className="font-bold text-[15px] text-zinc-200">{formatAmount(expense.amount)}</div>
                {youInvolved && (
                    <div className={`text-[11px] font-semibold mt-0.5 ${youPaid ? "text-emerald-400" : "text-red-400"}`}>
                        {youPaid ? `+${formatAmount(expense.amount - perPerson)}` : `−${formatAmount(perPerson)}`}
                    </div>
                )}
            </div>
        </div>
    );
}

interface MemberRowProps { member: Member; balance: number }
function MemberRow({ member, balance }: MemberRowProps) {
    const positive = balance > 0.01;
    const negative = balance < -0.01;
    return (
        <div className="flex items-center gap-3 bg-[#161616] border border-[#242424] rounded-2xl px-4 py-3">
            <Avatar name={member.name} isYou={member.isYou} />
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

interface DebtRowProps { transaction: Transaction }
function DebtRow({ transaction }: DebtRowProps) {
    const youDebtor   = transaction.from.isYou;
    const youCreditor = transaction.to.isYou;
    const highlighted = youDebtor || youCreditor;
    return (
        <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 border ${highlighted ? "bg-indigo-500/[0.07] border-indigo-500/20" : "bg-[#161616] border-[#242424]"}`}>
            <div className="flex items-center gap-2 flex-1 min-w-0">
                <Avatar name={transaction.from.name} isYou={transaction.from.isYou} />
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
                <Avatar name={transaction.to.name} isYou={transaction.to.isYou} />
            </div>
        </div>
    );
}

// ─── Add Expense Sheet ────────────────────────────────────────────────────────

interface AddExpenseSheetProps {
    open: boolean;
    onClose: () => void;
    members: Member[];
    onAdd: (expense: Expense) => void;
}

function AddExpenseSheet({ open, onClose, members, onAdd }: AddExpenseSheetProps) {
    const [description, setDescription] = useState<string>("");
    const [amount, setAmount]           = useState<string>("");
    const [category, setCategory]       = useState<CategoryId>("food");
    const [paidBy, setPaidBy]           = useState<string>("1");
    const [splitWith, setSplitWith]     = useState<string[]>(members.map(m => m.id));

    const toggleMember = (id: string): void =>
        setSplitWith(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const parsedAmount = parseFloat(amount);
    const valid = description.trim().length > 0 && !isNaN(parsedAmount) && parsedAmount > 0 && splitWith.length > 0;

    const handleAdd = (): void => {
        if (!valid) return;
        onAdd({
            id: `e${Date.now()}`,
            description: description.trim(),
            amount: parsedAmount,
            category,
            paidBy,
            splitWith,
            date: new Date().toISOString(),
        });
        setDescription(""); setAmount(""); setCategory("food");
        setPaidBy("1"); setSplitWith(members.map(m => m.id));
        onClose();
    };

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="bottom" className="bg-[#161616] border-t border-[#2a2a2a] rounded-t-3xl pb-10 max-h-[90vh] overflow-y-auto">
                <SheetHeader className="mb-5">
                    <SheetTitle className="text-zinc-100 text-lg font-bold">Новая трата</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-4">
                    <Input
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="За что платили?"
                        className="bg-[#1e1e1e] border-[#2a2a2a] text-zinc-100 placeholder:text-zinc-700 rounded-2xl h-12 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500"
                    />

                    <div className="relative">
                        <Input
                            value={amount}
                            onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                            placeholder="0"
                            type="number"
                            inputMode="decimal"
                            className="bg-[#1e1e1e] border-[#2a2a2a] text-zinc-100 placeholder:text-zinc-700 rounded-2xl h-14 text-2xl font-bold pr-10 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 font-bold text-lg">₽</span>
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-2">Категория</p>
                        <div className="grid grid-cols-4 gap-2">
                            {CATEGORIES.map(cat => {
                                const Icon = cat.icon;
                                return (
                                    <button key={cat.id} onClick={() => setCategory(cat.id)}
                                            className={`flex flex-col items-center gap-1.5 rounded-2xl py-2.5 border transition-all ${category === cat.id ? "bg-indigo-500/10 border-indigo-500/40" : "bg-[#1e1e1e] border-transparent hover:border-zinc-700"}`}
                                    >
                                        <Icon size={18} className={category === cat.id ? "text-indigo-400" : "text-zinc-500"} />
                                        <span className={`text-[10px] font-semibold ${category === cat.id ? "text-indigo-300" : "text-zinc-600"}`}>{cat.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-2">Кто платил</p>
                        <div className="flex gap-2 flex-wrap">
                            {members.map(m => (
                                <button key={m.id} onClick={() => setPaidBy(m.id)}
                                        className={`flex items-center gap-2 rounded-full px-3 py-1.5 border text-[13px] font-semibold transition-all ${paidBy === m.id ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300" : "bg-[#1e1e1e] border-[#2a2a2a] text-zinc-500 hover:border-zinc-600"}`}
                                >
                                    <div className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold text-white ${m.isYou ? "bg-indigo-500" : avatarColorClass(m.name)}`}>
                                        {m.isYou ? "Я" : m.name[0]}
                                    </div>
                                    {m.isYou ? "Вы" : m.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-2">Делим между</p>
                        <div className="flex gap-2 flex-wrap">
                            {members.map(m => {
                                const selected = splitWith.includes(m.id);
                                return (
                                    <button key={m.id} onClick={() => toggleMember(m.id)}
                                            className={`flex items-center gap-2 rounded-full px-3 py-1.5 border text-[13px] font-semibold transition-all ${selected ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-[#1e1e1e] border-[#2a2a2a] text-zinc-600"}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold text-white ${m.isYou ? "bg-indigo-500" : avatarColorClass(m.name)}`}>
                                            {m.isYou ? "Я" : m.name[0]}
                                        </div>
                                        {m.isYou ? "Вы" : m.name}
                                        {selected && <Check size={12} className="text-emerald-400" />}
                                    </button>
                                );
                            })}
                        </div>
                        {splitWith.length > 0 && parsedAmount > 0 && (
                            <p className="text-xs text-zinc-600 mt-2">
                                По {formatAmount(parsedAmount / splitWith.length)} с человека
                            </p>
                        )}
                    </div>
                </div>

                <Button onClick={handleAdd} disabled={!valid}
                        className="w-full mt-6 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 rounded-2xl h-12 text-[15px] font-bold"
                >
                    Добавить трату
                </Button>
            </SheetContent>
        </Sheet>
    );
}

// ─── Expense Detail Dialog ────────────────────────────────────────────────────

interface ExpenseDialogProps {
    expense: Expense | null;
    members: Member[];
    open: boolean;
    onClose: () => void;
}

function ExpenseDialog({ expense, members, open, onClose }: ExpenseDialogProps) {
    if (!expense) return null;
    const payer = members.find(m => m.id === expense.paidBy);
    const perPerson = expense.amount / expense.splitWith.length;
    const cat = getCategoryConfig(expense.category);
    const Icon = cat.icon;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-[#161616] border border-[#2a2a2a] rounded-3xl max-w-sm mx-4 p-6">
                <DialogHeader>
                    <div className={`w-12 h-12 rounded-2xl ${cat.bg} flex items-center justify-center mb-3`}>
                        <Icon size={22} className={cat.color} />
                    </div>
                    <DialogTitle className="text-zinc-100 text-lg font-bold text-left">{expense.description}</DialogTitle>
                </DialogHeader>
                <div className="mt-2 flex flex-col gap-3">
                    {[
                        { label: "Сумма",    value: <span className="font-extrabold text-xl text-zinc-100">{formatAmount(expense.amount)}</span> },
                        { label: "Заплатил", value: payer?.isYou ? "Вы" : payer?.name },
                        { label: "Дата",     value: formatDate(expense.date) },
                        { label: "С каждого",value: <span className="font-semibold text-emerald-400">{formatAmount(perPerson)}</span> },
                    ].map(row => (
                        <div key={row.label} className="flex justify-between items-center py-2.5 border-b border-[#242424]">
                            <span className="text-zinc-500 text-sm">{row.label}</span>
                            <span className="font-semibold text-zinc-200">{row.value}</span>
                        </div>
                    ))}
                    <div>
                        <p className="text-zinc-500 text-sm mb-2">Участники</p>
                        <div className="flex flex-wrap gap-2">
                            {expense.splitWith.map(uid => {
                                const m = members.find(x => x.id === uid);
                                if (!m) return null;
                                return (
                                    <div key={uid} className="flex items-center gap-1.5 bg-[#1e1e1e] rounded-full px-2.5 py-1">
                                        <div className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold text-white ${m.isYou ? "bg-indigo-500" : avatarColorClass(m.name)}`}>
                                            {m.isYou ? "Я" : m.name[0]}
                                        </div>
                                        <span className="text-xs text-zinc-400 font-medium">{m.isYou ? "Вы" : m.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GroupPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    console.log(id)

    // const { data: group, isLoading } = useQuery<Group>({
    //   queryKey: ["group", id],
    //   queryFn: () => fetchGroup(id!),
    // });

    const [group, setGroup] = useState<Group>(mockGroup);
    const [activeTab, setActiveTab]           = useState<TabId>("expenses");
    const [sheetOpen, setSheetOpen]           = useState<boolean>(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

    const totalSpent = group.expenses.reduce((s, e) => s + e.amount, 0);
    const myTotal    = group.expenses
        .filter(e => e.splitWith.includes("1"))
        .reduce((s, e) => s + e.amount / e.splitWith.length, 0);

    const { transactions, balances } = calcDebts(group.members, group.expenses);
    const myBalance = balances["1"] ?? 0;

    const handleAddExpense = (expense: Expense): void =>
        setGroup(prev => ({ ...prev, expenses: [expense, ...prev.expenses] }));

    return (
        <div className="min-h-screen bg-[#0f0f0f] max-w-[480px] mx-auto font-[Manrope,sans-serif]">
            <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.25s ease forwards; }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>

            <div className="px-4 pt-4 pb-0">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}
                            className="w-9 h-9 rounded-[12px] bg-[#1a1a1a] border border-[#2a2a2a] text-zinc-400 hover:text-zinc-100 hover:bg-[#242424] shrink-0"
                    >
                        <ChevronLeft size={20} />
                    </Button>
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <span className="text-2xl">{group.emoji}</span>
                        <h1 className="text-[18px] font-extrabold text-zinc-100 tracking-tight truncate">{group.name}</h1>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2.5 mb-5">
                    {[
                        { label: "Всего",      value: formatAmount(totalSpent), color: "text-zinc-200" },
                        { label: "Мои траты",  value: formatAmount(myTotal),    color: "text-zinc-200" },
                    ].map(stat => (
                        <div key={stat.label} className="bg-[#161616] border border-[#242424] rounded-2xl p-3">
                            <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">{stat.label}</div>
                            <div className={`font-extrabold text-[15px] ${stat.color}`}>{stat.value}</div>
                        </div>
                    ))}
                    <div className={`rounded-2xl p-3 border ${myBalance > 0.01 ? "bg-emerald-400/[0.07] border-emerald-400/20" : myBalance < -0.01 ? "bg-red-400/[0.07] border-red-400/20" : "bg-[#161616] border-[#242424]"}`}>
                        <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Баланс</div>
                        <div className={`font-extrabold text-[15px] ${myBalance > 0.01 ? "text-emerald-400" : myBalance < -0.01 ? "text-red-400" : "text-zinc-600"}`}>
                            {myBalance > 0.01 ? "+" : myBalance < -0.01 ? "−" : ""}{formatAmount(myBalance)}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-[#161616] border border-[#242424] rounded-2xl p-1 mb-4">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.id;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-[13px] font-semibold transition-all ${active ? "bg-[#242424] text-zinc-100" : "text-zinc-600 hover:text-zinc-400"}`}
                            >
                                <Icon size={14} />{tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab content */}
            <div className="px-4 pb-28">
                {activeTab === "expenses" && (
                    <div className="flex flex-col gap-2.5 fade-up">
                        {group.expenses.length === 0 ? (
                            <div className="flex flex-col items-center py-16 gap-3 text-center">
                                <div className="text-4xl">🧾</div>
                                <div className="font-bold text-zinc-300">Трат пока нет</div>
                                <div className="text-sm text-zinc-600">Добавь первую трату</div>
                            </div>
                        ) : group.expenses.map(exp => (
                            <ExpenseCard key={exp.id} expense={exp} members={group.members} onPress={setSelectedExpense} />
                        ))}
                    </div>
                )}

                {activeTab === "members" && (
                    <div className="flex flex-col gap-2.5 fade-up">
                        {group.members.map(m => (
                            <MemberRow key={m.id} member={m} balance={balances[m.id] ?? 0} />
                        ))}
                    </div>
                )}

                {activeTab === "balances" && (
                    <div className="flex flex-col gap-2.5 fade-up">
                        {transactions.length === 0 ? (
                            <div className="flex flex-col items-center py-16 gap-3 text-center">
                                <div className="text-4xl">✅</div>
                                <div className="font-bold text-zinc-300">Все квиты!</div>
                                <div className="text-sm text-zinc-600">Никто никому не должен</div>
                            </div>
                        ) : (
                            <>
                                <p className="text-xs text-zinc-600 mb-1">
                                    {transactions.length} {transactions.length < 5 ? "перевода" : "переводов"} чтобы закрыть все долги
                                </p>
                                {transactions.map((t, i) => <DebtRow key={i} transaction={t} />)}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* FAB */}
            <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto px-4 pb-6 pt-8 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent pointer-events-none">
                <Button onClick={() => setSheetOpen(true)}
                        className="pointer-events-auto w-full bg-indigo-500 hover:bg-indigo-600 rounded-2xl h-14 text-[15px] font-bold shadow-[0_4px_24px_rgba(99,102,241,0.4)]"
                >
                    <Plus size={20} className="mr-1.5" /> Добавить трату
                </Button>
            </div>

            <AddExpenseSheet open={sheetOpen} onClose={() => setSheetOpen(false)} members={group.members} onAdd={handleAddExpense} />
            <ExpenseDialog open={!!selectedExpense} expense={selectedExpense} members={group.members} onClose={() => setSelectedExpense(null)} />
        </div>
    );
}