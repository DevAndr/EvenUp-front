export function timeAgo(dateStr: string): string {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (days === 0) return "сегодня";
    if (days === 1) return "вчера";
    if (days < 7) return `${days} дн. назад`;
    return new Date(dateStr).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}
