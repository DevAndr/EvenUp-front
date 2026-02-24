import {useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {Button} from "@/components/ui/button";

import {
    ChevronLeft, Plus
} from "lucide-react";
import type {
    ApiExpense, ApiGroupMember,
    CategoryId,
    Expense, MemberMember, TabId,
} from "@/types/types.ts";
import {ExpenseDialog} from "@/components/Dialogs/ExpenseDialog.tsx";
import {ExpenseCard} from "@/components/ExpenseCard/ExpenseCard.tsx";
import {AddExpenseSheet} from "@/components/Sheet/AddExpenseSheet.tsx";
import {calcDebts, formatAmount} from "@/utils";
import {MemberRow} from "@/components/Rows/MemberRow.tsx";
import {DebtRow} from "@/components/DebtRow/DebtRow.tsx";
import {TABS} from "@/const";
import {useGetGroup} from "@/api/groups/useGetGroup.ts";
import {SkeletonCard} from "@/components/Skeleton/SkeletonCard.tsx";

function toMembers(apiMembers: ApiGroupMember[]): MemberMember[] {
    return apiMembers.map(m => ({
        id: m.userId,
        name: m.user.name,
        isYou: m.userId === CURRENT_USER_ID,
    }));
}

function toExpenses(apiExpenses: ApiExpense[]): Expense[] {
    return apiExpenses.map(e => ({
        id: e.id,
        description: e.description,
        amount: parseFloat(e.amount),
        category: e.category.toLowerCase() as CategoryId,
        date: e.date,
        paidBy: e.paidById,
        splitWith: e.splits.map(s => s.userId),
    }));
}

const CURRENT_USER_ID = "cmm0blr8v0000qt39oiujeac4";

export default function GroupPage() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {data: group, isLoading} = useGetGroup({id})
    const [activeTab, setActiveTab] = useState<TabId>("expenses");
    const [sheetOpen, setSheetOpen] = useState<boolean>(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

    const members  = useMemo(() => toMembers(group?.members ?? []), [group]);
    const expenses = useMemo(() => toExpenses(group?.expenses ?? []), [group]);

    const [localExpenses, setLocalExpenses] = useState<Expense[]>([]);
    const allExpenses = [...localExpenses, ...expenses];

    if (isLoading || !group) return <SkeletonCard/>

    const totalSpent = allExpenses.reduce((s, e) => s + e.amount, 0);
    const myTotal = allExpenses
        .filter(e => e.splitWith.includes(CURRENT_USER_ID))
        .reduce((s, e) => s + e.amount / e.splitWith.length, 0);

    const {transactions, balances} =  calcDebts(members, allExpenses);
    const myBalance = balances[CURRENT_USER_ID] ?? 0;

    const handleAddExpense = (expense: Expense): void =>
        setLocalExpenses(prev => [expense, ...prev]);

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
                        <ChevronLeft size={20}/>
                    </Button>
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <span className="text-2xl">{group.emoji}</span>
                        <h1 className="text-[18px] font-extrabold text-zinc-100 tracking-tight truncate">{group.name}</h1>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2.5 mb-5">
                    {[
                        {label: "Всего", value: formatAmount(totalSpent), color: "text-zinc-200"},
                        {label: "Мои траты", value: formatAmount(myTotal), color: "text-zinc-200"},
                    ].map(stat => (
                        <div key={stat.label} className="bg-[#161616] border border-[#242424] rounded-2xl p-3">
                            <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">{stat.label}</div>
                            <div className={`font-extrabold text-[15px] ${stat.color}`}>{stat.value}</div>
                        </div>
                    ))}
                    <div
                        className={`rounded-2xl p-3 border ${myBalance > 0.01 ? "bg-emerald-400/[0.07] border-emerald-400/20" : myBalance < -0.01 ? "bg-red-400/[0.07] border-red-400/20" : "bg-[#161616] border-[#242424]"}`}>
                        <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Баланс</div>
                        <div
                            className={`font-extrabold text-[15px] ${myBalance > 0.01 ? "text-emerald-400" : myBalance < -0.01 ? "text-red-400" : "text-zinc-600"}`}>
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
                                <Icon size={14}/>{tab.label}
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
                        ) : expenses.map(exp => (
                            <ExpenseCard key={exp.id} expense={exp} members={members}
                                         onPress={setSelectedExpense}/>
                        ))}
                    </div>
                )}

                {activeTab === "members" && (
                    <div className="flex flex-col gap-2.5 fade-up">
                        {members.map(m => (
                            <MemberRow key={m.id} member={m} balance={balances[m.id] ?? 0}/>
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
                                    {transactions.length} {transactions.length < 5 ? "перевода" : "переводов"} чтобы
                                    закрыть все долги
                                </p>
                                {transactions.map((t, i) => <DebtRow key={i} transaction={t}/>)}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* FAB */}
            <div
                className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto px-4 pb-6 pt-8 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent pointer-events-none">
                <Button onClick={() => setSheetOpen(true)}
                        className="pointer-events-auto w-full bg-indigo-500 hover:bg-indigo-600 rounded-2xl h-14 text-[15px] font-bold shadow-[0_4px_24px_rgba(99,102,241,0.4)]"
                >
                    <Plus size={20} className="mr-1.5"/> Добавить трату
                </Button>
            </div>

            <AddExpenseSheet open={sheetOpen} onClose={() => setSheetOpen(false)} members={members}
                             onAdd={handleAddExpense}/>
            <ExpenseDialog open={!!selectedExpense} expense={selectedExpense} members={members}
                           onClose={() => setSelectedExpense(null)}/>
        </div>
    );
}