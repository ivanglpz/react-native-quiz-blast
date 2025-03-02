import { SQLiteDatabase } from "expo-sqlite";
import { VerbTense } from "../db/types";

export const listVerbsById = async (
  db: SQLiteDatabase,
  langId: string
): Promise<VerbTense[]> => {
  return await db.getAllAsync(
    `SELECT * FROM verb_tenses WHERE language_id = ?`,
    [langId]
  );
};
