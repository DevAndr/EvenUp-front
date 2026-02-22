export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}