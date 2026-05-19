import { AppData } from "@/domain/models";

export const CURRENT_SCHEMA_VERSION = 1;

export function migrateAppData(data: AppData): AppData {
  if (data.settings.schemaVersion === CURRENT_SCHEMA_VERSION) return data;
  return { ...data, settings: { ...data.settings, schemaVersion: CURRENT_SCHEMA_VERSION } };
}
