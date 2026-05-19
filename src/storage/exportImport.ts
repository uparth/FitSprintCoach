import { AppData } from "@/domain/models";
import { appDataSchema } from "@/storage/schemas";
import { migrateAppData } from "@/storage/migrations";

export function buildBackupJson(data: AppData) {
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    app: "fitsprint-coach",
    data: appDataSchema.parse(data)
  }, null, 2);
}

export function parseBackupJson(raw: string) {
  const parsed = JSON.parse(raw);
  const candidate = parsed && typeof parsed === "object" && "data" in parsed ? parsed.data : parsed;
  return migrateAppData(appDataSchema.parse(candidate));
}

export function validateBackupJson(raw: string): { ok: true; data: AppData } | { ok: false; error: string } {
  try {
    return { ok: true, data: parseBackupJson(raw) };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Invalid backup JSON"
    };
  }
}
