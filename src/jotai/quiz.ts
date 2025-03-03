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
  isError: boolean;
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
        isError: false,
      };
    });
    set(GET_QUIZ_QUESTIONS_ATOM, questions);
  }
);
