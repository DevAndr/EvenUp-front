import type {BalanceMap, DebtEntry, DebtResult, Expense, MemberMember, Transaction} from "@/types/types.ts";

export function calcDebts(members: MemberMember[], expenses: Expense[]): DebtResult {
    const balances: BalanceMap = {};
    members.forEach(m => (balances[m.id] = 0));

    expenses.forEach(exp => {
        const per = exp.amount / exp.splitWith.length;
        exp.splitWith.forEach(uid => { balances[uid] = (balances[uid] ?? 0) - per; });
        balances[exp.paidBy] = (balances[exp.paidBy] ?? 0) + exp.amount;
    });

    const creditors: DebtEntry[] = [];
    const debtors: DebtEntry[] = [];
    Object.entries(balances).forEach(([uid, bal]) => {
        const m = members.find(x => x.id === uid);
        if (!m) return;
        if (bal >  0.01) creditors.push({ uid, name: m.name, isYou: m.isYou, amount: bal });
        if (bal < -0.01) debtors.push({ uid, name: m.name, isYou: m.isYou, amount: -bal });
    });

    const transactions: Transaction[] = [];
    const creds = creditors.map(x => ({ ...x }));
    const debts = debtors.map(x => ({ ...x }));
    let ci = 0, di = 0;
    while (ci < creds.length && di < debts.length) {
        const pay = Math.min(creds[ci].amount, debts[di].amount);
        transactions.push({ id: `${debts[di].uid}-${creds[ci].uid}`, from: { ...debts[di] }, to: { ...creds[ci] }, amount: pay });
        creds[ci].amount -= pay;
        debts[di].amount -= pay;
        if (creds[ci].amount < 0.01) ci++;
        if (debts[di].amount < 0.01) di++;
    }
    return { transactions, balances };
}