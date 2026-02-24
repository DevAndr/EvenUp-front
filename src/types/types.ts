// ─── Domain Types ─────────────────────────────────────────────────────────────

export type CategoryId = "FOOD" | "TAXI" | "GROCERY" | "HOME" | "MUSIC" | "PLANE" | "OTHER";
export type SplitType  = "EQUAL" | "CUSTOM";
export type GroupStatus = "ACTIVE" | "SETTLED" | "ARCHIVED";
export type TabId      = "expenses" | "members" | "balances";

export interface ApiUserShort {
    id: string;
    name: string;
    username: string | null;
}

/** Вложенный user в members[].user */
export interface ApiUserFull extends ApiUserShort {
    avatarUrl: string | null;
}

/** splits[] внутри expense */
export interface ApiExpenseSplit {
    id: string;
    amount: string;       // Decimal → строка, например "1200"
    expenseId: string;
    userId: string;
}

/** expenses[] */
export interface ApiExpense {
    id: string;
    description: string;
    amount: string;       // Decimal → строка, например "3600"
    category: CategoryId;
    date: string;         // ISO
    createdAt: string;    // ISO
    updatedAt: string;    // ISO
    paidById: string;
    groupId: string;
    paidBy: ApiUserShort;
    splits: ApiExpenseSplit[];
}

/** members[] */
export interface ApiGroupMember {
    id: string;
    joinedAt: string;     // ISO
    groupId: string;
    userId: string;
    user: ApiUserFull;
}

/** GET /groups/:id */
export interface ApiGroup {
    id: string;
    name: string;
    emoji: string;
    description: string | null;
    splitType: SplitType;
    status: GroupStatus;
    createdAt: string;    // ISO
    updatedAt: string;    // ISO
    ownerId: string;
    owner: ApiUserShort;
    members: ApiGroupMember[];
    expenses: ApiExpense[];
}

// ─── UI / Internal Types ───────────────────────────────────────────────────────

/** Участник после маппинга из ApiGroupMember */
export interface MemberMember {
    id: string;           // = ApiGroupMember.userId
    name: string;
    isYou: boolean;
    phone?: string;
}

/** Трата после маппинга из ApiExpense */
export interface Expense {
    id: string;
    description: string;
    amount: number;       // parseFloat(ApiExpense.amount)
    category: CategoryId; // ApiCategoryId.toLowerCase()
    date: string;         // ISO
    paidBy: string;       // userId
    splitWith: string[];  // ApiExpenseSplit[].userId[]
}

// ─── GroupSummary (GET /groups — список групп) ─────────────────────────────────

export interface ApiGroupSummaryMember {
    id: string;
    name: string;
}

export interface ApiGroupSummary {
    id: string;
    name: string;
    emoji: string;
    membersCount: number;
    totalAmount: number;
    myBalance: number;
    lastActivity: string;
    members: ApiGroupSummaryMember[];
}

// ─── Debt calculation types ────────────────────────────────────────────────────

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

// ─── API Payloads ──────────────────────────────────────────────────────────────

export interface CreateGroupPayload {
    emoji: string;
    name: string;
    description: string;
    members: string[];
    splitType: SplitType;
}

export interface SplitInput {
    userId: string;
    amount: number;
}

export interface CreateExpensePayload {
    description: string;
    amount: number;
    category: CategoryId;
    paidById: string;
    splits?: SplitInput[];  // если не передать — бэк делит поровну
    date?: string;
}

export interface MarkSettledPayload {
    groupId: string;
    fromUserId: string;
    toUserId: string;
    amount: number;
}

