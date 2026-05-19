import { AppData } from "@/domain/models";
import { appDataSchema } from "@/storage/schemas";

export function buildBackupJson(data: AppData) {
  return JSON.stringify(appDataSchema.parse(data), null, 2);
}

export function parseBackupJson(raw: string) {
  return appDataSchema.parse(JSON.parse(raw));
}
