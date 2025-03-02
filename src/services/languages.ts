import { SQLiteDatabase } from "expo-sqlite";
import { Language } from "../db/types";

export const listLanguages = async (
  db: SQLiteDatabase
): Promise<Language[]> => {
  return await db.getAllAsync("SELECT * FROM languages");
};
