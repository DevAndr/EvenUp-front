import type {Group, GroupSummary} from "@/types/types.ts";

export const mockGroups: GroupSummary[] = [
    {
        id: "1",
        name: "Поездка в Питер",
        emoji: "🏙️",
        membersCount: 5,
        totalAmount: 47800,
        myBalance: -3200,
        lastActivity: "2025-02-20T10:00:00Z",
        members: [{ id: "1", name: "Саша" }, { id: "2", name: "Маша" }, { id: "3", name: "Дима" }],
    },
    {
        id: "2",
        name: "Квартира на Ленина",
        emoji: "🏠",
        membersCount: 3,
        totalAmount: 12500,
        myBalance: 1800,
        lastActivity: "2025-02-18T15:30:00Z",
        members: [{ id: "4", name: "Коля" }, { id: "5", name: "Юля" }],
    },
    {
        id: "3",
        name: "Корпоратив февраль",
        emoji: "🎉",
        membersCount: 12,
        totalAmount: 86000,
        myBalance: 0,
        lastActivity: "2025-02-14T20:00:00Z",
        members: [{ id: "6", name: "Антон" }, { id: "7", name: "Лена" }, { id: "8", name: "Игорь" }],
    },
    {
        id: "4",
        name: "Лыжный weekend",
        emoji: "⛷️",
        membersCount: 4,
        totalAmount: 28400,
        myBalance: -650,
        lastActivity: "2025-02-10T09:00:00Z",
        members: [{ id: "9", name: "Вова" }, { id: "10", name: "Катя" }],
    },
];


export const mockGroup: Group = {
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