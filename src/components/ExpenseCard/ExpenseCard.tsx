import type {Expense, Member, Transaction} from "@/types/types.ts";
import type {FC} from "react";
import {CategoryIcon} from "@/components/CategoryIcon/CategoryIcon.tsx";
import {formatAmount, formatDate} from "@/utils";

interface ExpenseCardProps {
    expense: Expense;
    members: Member[];
    onPress: (expense: Expense) => void;
}

export const ExpenseCard: FC<ExpenseCardProps> = ({ expense, members, onPress }: ExpenseCardProps) =>  {
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
