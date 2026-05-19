import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { z } from "zod";

const rootDir = `${FileSystem.documentDirectory ?? ""}fitsprint-coach`;
const webPrefix = "fitsprint-coach";

async function ensureRoot() {
  if (Platform.OS === "web") return;
  const info = await FileSystem.getInfoAsync(rootDir);
  if (!info.exists) await FileSystem.makeDirectoryAsync(rootDir, { intermediates: true });
}

export function getDataPath(fileName: string) {
  if (Platform.OS === "web") return `${webPrefix}:${fileName}`;
  return `${rootDir}/${fileName}`;
}

export async function readJsonFile<T>(fileName: string, schema: z.ZodType<T>, fallback: T): Promise<T> {
  if (Platform.OS === "web") {
    const raw = globalThis.localStorage?.getItem(getDataPath(fileName));
    if (!raw) {
      if (fallback !== undefined) await writeJsonFile(fileName, fallback);
      return fallback;
    }
    return schema.parse(JSON.parse(raw));
  }

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
  if (Platform.OS === "web") {
    globalThis.localStorage?.setItem(getDataPath(fileName), JSON.stringify(data, null, 2));
    return;
  }

  await ensureRoot();
  await FileSystem.writeAsStringAsync(getDataPath(fileName), JSON.stringify(data, null, 2));
}

export async function deleteJsonFile(fileName: string): Promise<void> {
  if (Platform.OS === "web") {
    globalThis.localStorage?.removeItem(getDataPath(fileName));
    return;
  }

  const path = getDataPath(fileName);
  const info = await FileSystem.getInfoAsync(path);
  if (info.exists) await FileSystem.deleteAsync(path, { idempotent: true });
}
