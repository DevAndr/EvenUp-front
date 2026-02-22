// ─── Domain Types ─────────────────────────────────────────────────────────────

export type CategoryId = "food" | "taxi" | "grocery" | "home" | "music" | "plane" | "other";
export type SplitType  = "equal" | "custom";
export type GroupStatus = "active" | "settled" | "archived";
export type TabId      = "expenses" | "members" | "balances";

export interface Member {
    id: string;
    name: string;
    isYou: boolean;
    phone?: string;
}

export interface Expense {
    id: string;
    description: string;
    amount: number;
    paidBy: string;       // Member.id
    splitWith: string[];  // Member.id[]
    category: CategoryId;
    date: string;         // ISO string
}

export interface Settlement {
    id: string;
    fromUserId: string;
    toUserId: string;
    amount: number;
    settledAt: string;
}

export interface Group {
    id: string;
    name: string;
    emoji: string;
    splitType: SplitType;
    status: GroupStatus;
    members: Member[];
    expenses: Expense[];
    settlements?: Settlement[];
    createdAt: string;
}

// ─── Derived / Computed Types ─────────────────────────────────────────────────

export interface GroupMemberPreview {
    id: string;
    name: string;
}

export interface GroupSummary {
    id: string;
    name: string;
    emoji: string;
    membersCount: number;
    totalAmount: number;
    myBalance: number;
    lastActivity: string;
    members: GroupMemberPreview[];
}

export type BalanceMap = Record<string, number>;

export interface DebtEntry {
    uid: string;
    name: string;
    isYou: boolean;
    amount: number;
}

export interface Transaction {
    id: string;
    from: DebtEntry;
    to: DebtEntry;
    amount: number;
}

export interface DebtResult {
    transactions: Transaction[];
    balances: BalanceMap;
}

// ─── Form / API Payload Types ─────────────────────────────────────────────────

export interface CreateGroupPayload {
    emoji: string;
    name: string;
    description: string;
    members: string[];
    splitType: SplitType;
}

export interface CreateExpensePayload {
    description: string;
    amount: number;
    category: CategoryId;
    paidBy: string;
    splitWith: string[];
}

export interface MarkSettledPayload {
    groupId: string;
    fromUserId: string;
    toUserId: string;
    amount: number;
}