import * as Crypto from "expo-crypto";
import { SQLiteDatabase } from "expo-sqlite";
import { QuizAttempt } from "../db/types";
export const createQuizAttempts = async (
  db: SQLiteDatabase,
  values: Omit<Partial<QuizAttempt>, "id" | "timestamp">
) => {
  if (!values?.quiz_id || !values?.user_id) return;
  const UUID = Crypto.randomUUID();

  const statement = await db.prepareAsync(
    "INSERT INTO quiz_attempts (id, quiz_id, user_id) VALUES (?, ?, ?)"
  );
  try {
    await statement.executeAsync(UUID, values?.quiz_id, values?.user_id);
    return {
      id: UUID,
      ...values,
    };
  } finally {
    await statement.finalizeAsync();
  }
};

export const fetchQuizAttempt = async (
  db: SQLiteDatabase,
  id: string
): Promise<QuizAttempt | null> => {
  return await db.getFirstAsync("SELECT * FROM quiz_attempts  WHERE id = ?;", [
    id,
  ]);
};

export const ListhQuizAttempts = async (
  db: SQLiteDatabase,
  quiz_id: string
): Promise<QuizAttempt[] | null> => {
  return await db.getAllAsync(
    "SELECT * FROM quiz_attempts  WHERE quiz_id = ?;",
    [quiz_id]
  );
};
