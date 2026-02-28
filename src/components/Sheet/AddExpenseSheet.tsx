import {type FC, useState} from "react";
import type {CategoryId, CreateExpensePayload, MemberMember} from "@/types/types.ts";
import {Button} from "@/components/ui/button.tsx";
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Input} from "@/components/ui/input";
import {CATEGORIES} from "@/const";
import {avatarColorClass, formatAmount, isDefined} from "@/utils";
import {Check} from "lucide-react";
import {CURRENT_USER_ID} from "@/pages/GroupPage/GroupPage.tsx";
import {useCreateExpenses} from "@/api/expenses/useCreateExpenses.ts";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";

interface AddExpenseSheetProps {
    open: boolean,
    onClose: () => void,
    members: MemberMember[],
    idGroup?: string | undefined
}

export const AddExpenseSheet: FC<AddExpenseSheetProps> = ({
                                                              open,
                                                              onClose,
                                                              members,
                                                              idGroup
                                                          }: AddExpenseSheetProps) => {
    const [description, setDescription] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [category, setCategory] = useState<CategoryId>("FOOD");
    const [paidBy, setPaidBy] = useState<string>(CURRENT_USER_ID);
    const [splitWith, setSplitWith] = useState<string[]>(members.map(m => m.id));
    const [splits, setSplits] = useState<Map<string, number>>()
    const {mutate: createExpenses} = useCreateExpenses();

    const parsedAmount = parseFloat(amount || '0');
    const peerAmount = parsedAmount / splitWith.length
    const peerAmountFormated = formatAmount(peerAmount)
    const valid = description.trim().length > 0 && !isNaN(parsedAmount) && parsedAmount > 0 && splitWith.length > 0;

    const toggleMember = (id: string): void =>
        setSplitWith(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);


    const handleAdd = (): void => {
        if (!valid || !isDefined(idGroup)) return;

        let amountsSplit = null

        if (splits && splits.size > 0) {
            amountsSplit = Array.from(splits, ([id, amount]) => ({ userId: id, amount }));
        }

        const data: CreateExpensePayload = {
            description,
            amount: Number(amount),
            category,
            paidById: CURRENT_USER_ID,
            date: new Date().toISOString(),
        }

        if (isDefined(amountsSplit)) {
            data['splits'] = amountsSplit;
        }

        createExpenses({
            idGroup, data
        }, {
            onSuccess: () => {
                setDescription("");
                setAmount("");
                setCategory("FOOD");
                setPaidBy(CURRENT_USER_ID);
                setSplitWith(members.map(m => m.id));
                setSplits(new Map())
                onClose();
            }
        })
    };

    const peerAmountHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const amount = Number(e.target.value.replace(/[^0-9.]/g, ""));
        const memberId = e.target.getAttribute('member-id') as string;
        const newSplitsMap = new Map(splits)
        newSplitsMap.set(memberId, amount);
        setSplits(newSplitsMap);
    }

    const amountHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const amount = e.target.value.replace(/[^0-9.]/g, "")
        const parsedAmount = parseFloat(amount || '0');
        const peerAmount = Math.trunc(parsedAmount / splitWith.length)
        setAmount(amount)

        const newSplits = new Map(splits);

        members.map(m => {
            newSplits.set(m.id, peerAmount)
        })

        setSplits(newSplits)
    }

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="bottom"
                          className="bg-[#161616] border-t border-[#2a2a2a] rounded-t-3xl p-4 pb-10 max-h-[90vh] overflow-y-auto">
                <SheetHeader className="mb-5">
                    <SheetTitle className="text-zinc-100 text-lg font-bold">Новая трата</SheetTitle>
                </SheetHeader>

                <Tabs defaultValue='propperties'>
                    <TabsList>
                        <TabsTrigger value="propperties">Свойства</TabsTrigger>
                        <TabsTrigger value="shares">Доли</TabsTrigger>
                    </TabsList>
                    <TabsContent value="propperties">
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
                                    onChange={amountHandler}
                                    placeholder="0"
                                    type="number"
                                    inputMode="decimal"
                                    className="bg-[#1e1e1e] border-[#2a2a2a] text-zinc-100 placeholder:text-zinc-700 rounded-2xl h-14 text-2xl font-bold pr-10 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500"
                                />
                                <span
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 font-bold text-lg">₽</span>
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
                                                <Icon size={18}
                                                      className={category === cat.id ? "text-indigo-400" : "text-zinc-500"}/>
                                                <span
                                                    className={`text-[10px] font-semibold ${category === cat.id ? "text-indigo-300" : "text-zinc-600"}`}>{cat.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-2">Кто
                                    платил</p>
                                <div className="flex gap-2 flex-wrap">
                                    {members.map(m => (
                                        <button key={m.id} onClick={() => setPaidBy(m.id)}
                                                className={`flex items-center gap-2 rounded-full px-3 py-1.5 border text-[13px] font-semibold transition-all ${paidBy === m.id ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300" : "bg-[#1e1e1e] border-[#2a2a2a] text-zinc-500 hover:border-zinc-600"}`}
                                        >
                                            <div
                                                className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold text-white ${m.isYou ? "bg-indigo-500" : avatarColorClass(m.name)}`}>
                                                {m.isYou ? "Я" : m.name[0]}
                                            </div>
                                            {m.isYou ? "Вы" : m.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-2">Делим
                                    между</p>
                                <div className="flex gap-2 flex-wrap">
                                    {members.map(m => {
                                        const selected = splitWith.includes(m.id);
                                        return (
                                            <button key={m.id} onClick={() => toggleMember(m.id)}
                                                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 border text-[13px] font-semibold transition-all ${selected ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-[#1e1e1e] border-[#2a2a2a] text-zinc-600"}`}
                                            >
                                                <div
                                                    className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold text-white ${m.isYou ? "bg-indigo-500" : avatarColorClass(m.name)}`}>
                                                    {m.isYou ? "Я" : m.name[0]}
                                                </div>
                                                {m.isYou ? "Вы" : m.name}
                                                {selected && <Check size={12} className="text-emerald-400"/>}
                                            </button>
                                        );
                                    })}
                                </div>
                                {splitWith.length > 0 && parsedAmount > 0 && (
                                    <p className="text-xs text-zinc-600 mt-2">
                                        По {peerAmountFormated} с человека
                                    </p>
                                )}
                            </div>
                        </div>

                        <Button onClick={handleAdd} disabled={!valid}
                                className="w-full mt-6 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 rounded-2xl h-12 text-[15px] font-bold"
                        >
                            Добавить трату
                        </Button>
                    </TabsContent>
                    <TabsContent value="shares">
                        <table className='w-full'>
                            <tbody>
                            {members.map(m => (
                                <tr key={m.id}>
                                    <th>
                                        <button key={m.id}
                                                className={`flex flex-[1_0_auto] items-center gap-2 rounded-full px-3 py-1.5 border text-[13px] font-semibold transition-all bg-[#1e1e1e] border-[#2a2a2a] text-zinc-500 hover:border-zinc-600"}`}
                                        >
                                            <div
                                                className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold text-white ${m.isYou ? "bg-indigo-500" : avatarColorClass(m.name)}`}>
                                                {m.isYou ? "Я" : m.name[0]}
                                            </div>
                                            {m.isYou ? "Вы" : m.name}
                                        </button>
                                    </th>
                                    <th>
                                        <Input member-id={m.id} value={splits?.get(m.id)}
                                               onChange={peerAmountHandler}/>
                                    </th>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}
