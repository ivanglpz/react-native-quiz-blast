import * as Crypto from "expo-crypto";
import { SQLiteDatabase } from "expo-sqlite";
import { Question, Quiz } from "../db/types";

export const createQuiz = async (
  db: SQLiteDatabase,
  values: Omit<Quiz, "id">
) => {
  const UUID = Crypto.randomUUID();

  const statement = await db.prepareAsync(
    "INSERT INTO quizzes (id, language_id, title, subtitle) VALUES (?, ?, ?, ?) RETURNING id"
  );
  try {
    await statement.executeAsync(
      UUID,
      values?.language_id,
      values?.title,
      values?.subtitle
    );
    return {
      ...values,
      id: UUID,
    };
  } finally {
    await statement.finalizeAsync();
  }
};

export const createQuestionQuiz = async (
  db: SQLiteDatabase,
  values: Omit<Question, "id">
) => {
  if (
    !values?.question ||
    !values?.answer ||
    !values?.option_one ||
    !values?.option_three ||
    !values?.option_two ||
    !values?.quiz_id
  )
    return;
  const UUID = Crypto.randomUUID();

  const statement = await db.prepareAsync(
    "INSERT INTO questions (id, quiz_id, question, option_one, option_two, option_three, answer) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id"
  );
  try {
    await statement.executeAsync(
      UUID,
      values?.quiz_id,
      values?.question,
      values?.option_one,
      values?.option_two,
      values?.option_three,
      values?.answer
    );
    return {
      ...values,
      id: UUID,
    };
  } finally {
    await statement.finalizeAsync();
  }
};
export const listQuiz = async (
  db: SQLiteDatabase,
  langId?: string
): Promise<Quiz[]> => {
  if (!langId) return [];
  const data = (await db.getAllAsync(
    `SELECT * FROM quizzes WHERE language_id = ?`,
    [langId]
  )) as Quiz[];
  return data?.reverse();
};

export const fetchQuiz = async (
  db: SQLiteDatabase,
  id: string
): Promise<Quiz | null> => {
  return await db.getFirstAsync("SELECT * FROM quizzes WHERE id = ?;", [id]);
};
