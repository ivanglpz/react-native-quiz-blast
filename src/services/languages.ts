import { SQLiteDatabase } from "expo-sqlite";
import { Language } from "../db/types";

export const listLanguages = async (
  db: SQLiteDatabase
): Promise<Language[]> => {
  return await db.getAllAsync("SELECT * FROM languages");
};

export const fetchLanguage = async (
  db: SQLiteDatabase,
  id: string
): Promise<Language | null> => {
  return await db.getFirstAsync("SELECT * FROM languages WHERE id = ?;", [id]);
};
