import { SQLiteDatabase } from "expo-sqlite";
import { Question } from "../db/types";

export const fetchQuestions = async (db: SQLiteDatabase, quiz_id: string) => {
  const data = (await db.getAllAsync(
    `SELECT * FROM questions WHERE quiz_id = ?`,
    [quiz_id]
  )) as Question[];
  return data;
};
