import { addDays, formatISO, parseISO } from "date-fns";

export function todayISO() {
  return formatISO(new Date(), { representation: "date" });
}

export function nowISO() {
  return new Date().toISOString();
}

export function addDaysISO(date: string, days: number) {
  return formatISO(addDays(parseISO(date), days), { representation: "date" });
}
