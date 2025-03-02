import * as Crypto from "expo-crypto";

export const createPrompt = (language: string, verbTense: string) => `
Generate exactly 10 multiple-choice questions about verb tenses in a language. The verb tense and language will be provided as parameters: [${language}], [${verbTense}].

Requirements:
- The response **must be in CSV format only**, with no explanations, greetings, or additional text.
- The CSV must contain the following columns: question, option_one, option_two, option_three, answer.
- Each question must include a blank (___) where the correct answer should go.
- The answer column must contain the correct option's name (e.g., option_two).
- The questions must be diverse, using different subjects such as "He", "She", "It", "They", "We", "I".
- The questions must be randomly generated and vary in structure and order. Do not mimic the exact phrasing or sequence of the examples provided below.
- The structure and grammar of the questions must adapt to the specified language and verb tense, following proper grammatical rules.
- **If multiple valid constructions exist for the verb tense (e.g., for English future simple, both 'will' and 'going to' are acceptable), include appropriate options accordingly.**
- Questions must be short and related to topics such as sports, food, travel, restaurants, work, and money.
- The questions must focus **only on the given verb tense** for the specified language.
- Ensure varied correct answers.

The response must strictly follow this format (without adding "csv" or any explanation):

question,option_one,option_two,option_three,answer
"Sample question with a ___ for the correct answer","option1","option2","option3","option1"

Return only the CSV content, nothing else.
`;

export const convertCSVToArray = async (csv: string, quizId: string) => {
  const lines = csv.split("\n");
  const questions = lines.map((line) => {
    const parts = line
      ?.match(/\"(.*?)\"/g)
      ?.map((part) => part.replace(/\"/g, ""));
    const UUID = Crypto.randomUUID();

    return {
      id: UUID,
      quiz_id: quizId,
      question: parts?.[0] ?? "",
      option_one: parts?.[1] ?? "",
      option_two: parts?.[2] ?? "",
      option_three: parts?.[3] ?? "",
      answer: parts?.[4] ?? "",
    };
  });

  return questions;
};
