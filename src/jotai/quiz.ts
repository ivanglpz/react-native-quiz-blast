import * as Crypto from "expo-crypto";
import { atom, PrimitiveAtom } from "jotai";
import { Answer, Question } from "../db/types";

export type WithInitialValue<Value> = {
  init: Value;
};

export const GET_QUIZ_QUESTIONS_ATOM = atom<
  {
    question: Question;
    answer: PrimitiveAtom<Partial<Answer> | null> &
      WithInitialValue<Partial<Answer> | null>;
    id: string;
  }[]
>([]);

export const SET_QUIZ_QUESTIONS_ATOM = atom(
  null,
  (get, set, args: Question[]) => {
    const questions = args?.map((e) => {
      const UUID = Crypto.randomUUID();

      return {
        question: e,
        answer: atom<Partial<Answer> | null>(null),
        id: UUID,
      };
    });
    set(GET_QUIZ_QUESTIONS_ATOM, questions);
  }
);
