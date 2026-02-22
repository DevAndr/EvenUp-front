 import {type FC} from "react";
import type {Expense, Member} from "@/types/types.ts";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
 import {avatarColorClass, formatAmount, formatDate, getCategoryConfig} from "@/utils";

interface ExpenseDialogProps {
    expense: Expense | null;
    members: Member[];
    open: boolean;
    onClose: () => void;
}

export const ExpenseDialog: FC<ExpenseDialogProps> = ({ expense, members, open, onClose }: ExpenseDialogProps) =>  {
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