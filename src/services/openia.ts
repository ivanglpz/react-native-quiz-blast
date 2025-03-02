export const prompt_ia = (language: string, verbTense: string) => `
Generate a CSV file with 10 multiple-choice questions about verb tenses in a language. The verb tense and language will be provided as parameters: [${language}], [${verbTense}].

Requirements:
- Questions must be short and related to sports, food, travel, restaurants, work, and money.
- Response must be in CSV format with columns: question, option_one, option_two, option_three, answer.
- answer must indicate the correct option (e.g., option_two).
- Focus only on the given verb tense for the specified language.
- Ensure varied correct answers.

Example output (for English, Present Perfect):

csv
question,option_one,option_two,option_three,answer
"Have you ever ___ to Paris?","go","been","went","option_two"
"She has never ___ sushi before.","eat","ate","eaten","option_three"


Provide exactly 10 questions in this format.`;
