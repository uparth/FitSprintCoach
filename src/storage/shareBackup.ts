import { Share } from "react-native";
import { AppData } from "@/domain/models";
import { buildBackupJson } from "@/storage/exportImport";

export async function shareBackup(data: AppData) {
  const backup = buildBackupJson(data);
  await Share.share({
    title: "FitSprint Coach backup",
    message: backup
  });
  return backup;
}
