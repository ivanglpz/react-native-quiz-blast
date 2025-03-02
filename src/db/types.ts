export type Language = {
  id: string; // UUID
  name: string;
  slug: string;
};

export type VerbTense = {
  id: string; // UUID
  language_id: string;
  name: string;
};

export type Quiz = {
  id: string; // UUID
  language_id: string;
  title: string;
  subtitle: string;
};

export type Question = {
  id: string; // UUID
  quiz_id: string;
  question: string;
  option_one: string;
  option_two: string;
  option_three: string;
  answer: string; // Respuesta correcta
};

export type QuizAttempt = {
  id: string; // UUID
  quiz_id: string;
  user_id: string; // Puedes adaptarlo si manejas autenticación
  timestamp: string; // Fecha y hora en formato ISO 8601
};

export type Answer = {
  id: string; // UUID
  attempt_id: string;
  question_id: string;
  selected_option: string;
  is_correct: boolean;
};
