import * as Crypto from "expo-crypto";
import { SQLiteDatabase } from "expo-sqlite";
import { Answer } from "../db/types";
export const createAnswerQuizAttempt = async (
  db: SQLiteDatabase,
  values: Omit<Partial<Answer>, "id" | "timestamp">
) => {
  if (!values?.attempt_id || !values?.attempt_id) return;
  const UUID = Crypto.randomUUID();

  const statement = await db.prepareAsync(
    `
    INSERT INTO answers (id, attempt_id, question_id, selected_option, is_correct)
    VALUES (?, ?, ?, ?, ?)
    RETURNING id;

    `
  );
  try {
    await statement.executeAsync(
      UUID,
      values?.attempt_id,
      values?.question_id ?? "",
      values?.selected_option ?? "",
      values?.is_correct ?? false
    );
    return {
      id: UUID,
      ...values,
    };
  } finally {
    await statement.finalizeAsync();
  }
};
