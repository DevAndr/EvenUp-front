import type {GroupSummary} from "@/types/types.ts";

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
