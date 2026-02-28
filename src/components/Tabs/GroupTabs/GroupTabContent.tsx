import type {FC} from "react";
import type {ApiGroup, BalanceMap, Expense, MemberMember, TabId, Transaction} from "@/types/types.ts";
import {ExpenseCard} from "@/components/ExpenseCard/ExpenseCard.tsx";
import {MemberRow} from "@/components/Rows/MemberRow.tsx";
import {DebtRow} from "@/components/DebtRow/DebtRow.tsx";

interface Props {
    activeTab: TabId;
    group: ApiGroup;
    expenses: Expense[];
    members: MemberMember[];
    balances: BalanceMap;
    transactions: Transaction[];
    setSelectedExpense: (expense: Expense) => void
}

export const GroupTabContent: FC<Props> = ({activeTab, group, expenses, members, balances, transactions, setSelectedExpense}) => {

    return <div className="px-4 pb-28">
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
}