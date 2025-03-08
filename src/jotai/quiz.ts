import * as Crypto from "expo-crypto";
import { atom, PrimitiveAtom } from "jotai";
import { Answer, Question } from "../db/types";

export type WithInitialValue<Value> = {
  init: Value;
};

export type IQUIZ_FORM = {
  question: Question;
  answer: PrimitiveAtom<Partial<Answer> | null> &
    WithInitialValue<Partial<Answer> | null>;
  id: string;
  isError: PrimitiveAtom<Partial<boolean>> & WithInitialValue<Partial<boolean>>;
};

export const GET_QUIZ_QUESTIONS_ATOM = atom<IQUIZ_FORM[]>([]);

export const SET_QUIZ_QUESTIONS_ATOM = atom(
  null,
  (get, set, args: Question[]) => {
    const questions = args?.map((e) => {
      const UUID = Crypto.randomUUID();

      return {
        question: e,
        answer: atom<Partial<Answer> | null>(null),
        id: UUID,
        isError: atom(false),
      };
    });
    set(GET_QUIZ_QUESTIONS_ATOM, questions);
  }
);

export const GET_RESULT_QUESTIONS = atom(null, (get, set) => {
  const questions = get(GET_QUIZ_QUESTIONS_ATOM)?.map((e) => {
    return {
      ...e,
      answer: get(e?.answer),
    };
  });

  const isCompleted = questions.every((e) => e?.answer?.selected_option);
  if (!isCompleted) {
    for (const iterator of questions) {
      if (!iterator?.answer?.question_id) {
        set(iterator?.isError, true);
      }
    }
    return {
      status: "error",
      data: [],
    };
  }
  return {
    status: "completed",
    data: questions,
  };
});
