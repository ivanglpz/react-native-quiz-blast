import * as Crypto from "expo-crypto";
import { SQLiteDatabase } from "expo-sqlite";
import { Answer, Question } from "../db/types";
export const createAnswerQuizAttempt = async (
  db: SQLiteDatabase,
  values: Omit<Partial<Answer>, "id" | "timestamp">
) => {
  if (!values?.attempt_id || !values?.attempt_id) return;
  const UUID = Crypto.randomUUID();

  const statement = await db.prepareAsync(
    `
    INSERT INTO answers (id, attempt_id, question_id, selected_option, is_correct)
    VALUES (?, ?, ?, ?, ?);

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

type UnionData = Answer & Question;

export const listAnswersQuizAttempt = async (
  db: SQLiteDatabase,
  attempt_id: string
): Promise<UnionData[]> => {
  const data = (await db.getAllAsync(
    `
        SELECT
    q.id AS question_id,
    q.quiz_id,
    q.question,
    q.option_one,
    q.option_two,
    q.option_three,
    q.answer AS correct_answer,
    a.id AS answer_id,
    a.attempt_id,
    a.selected_option,
    a.is_correct
    FROM questions q
    LEFT JOIN answers a ON q.id = a.question_id
    WHERE a.attempt_id = ?;

    `,
    [attempt_id]
  )) as UnionData[];
  return data?.reverse();
};
