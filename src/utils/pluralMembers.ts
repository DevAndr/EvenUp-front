export function pluralMembers(count: number): string {
    if (count === 1) return "участник";
    if (count < 5)  return "участника";
    return "участников";
}