import * as FileSystem from "expo-file-system";
import { z } from "zod";

const rootDir = `${FileSystem.documentDirectory ?? ""}fitsprint-coach`;

async function ensureRoot() {
  const info = await FileSystem.getInfoAsync(rootDir);
  if (!info.exists) await FileSystem.makeDirectoryAsync(rootDir, { intermediates: true });
}

export function getDataPath(fileName: string) {
  return `${rootDir}/${fileName}`;
}

export async function readJsonFile<T>(fileName: string, schema: z.ZodType<T>, fallback: T): Promise<T> {
  await ensureRoot();
  const path = getDataPath(fileName);
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) {
    if (fallback !== undefined) await writeJsonFile(fileName, fallback);
    return fallback;
  }
  const raw = await FileSystem.readAsStringAsync(path);
  const parsed = JSON.parse(raw);
  return schema.parse(parsed);
}

export async function writeJsonFile<T>(fileName: string, data: T): Promise<void> {
  await ensureRoot();
  await FileSystem.writeAsStringAsync(getDataPath(fileName), JSON.stringify(data, null, 2));
}

export async function deleteJsonFile(fileName: string): Promise<void> {
  const path = getDataPath(fileName);
  const info = await FileSystem.getInfoAsync(path);
  if (info.exists) await FileSystem.deleteAsync(path, { idempotent: true });
}
