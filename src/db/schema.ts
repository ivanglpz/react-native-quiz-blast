export const schema = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS languages (
    id TEXT PRIMARY KEY NOT NULL, -- UUID
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS verb_tenses (
    id TEXT PRIMARY KEY NOT NULL, -- UUID
    language_id TEXT NOT NULL,
    name TEXT NOT NULL UNIQUE,
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS quizzes (
    id TEXT PRIMARY KEY NOT NULL, -- UUID
    language_id TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY NOT NULL, -- UUID
    quiz_id TEXT NOT NULL,
    question TEXT NOT NULL,
    option_one TEXT NOT NULL,
    option_two TEXT NOT NULL,
    option_three TEXT NOT NULL,
    answer TEXT NOT NULL, -- Respuesta correcta
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id TEXT PRIMARY KEY NOT NULL, -- UUID
    quiz_id TEXT NOT NULL,
    user_id TEXT NOT NULL, -- Puedes adaptarlo si manejas autenticación
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS answers (
    id TEXT PRIMARY KEY NOT NULL, -- UUID
    attempt_id TEXT NOT NULL,
    question_id TEXT NOT NULL,
    selected_option TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);


INSERT OR IGNORE INTO languages (id, name, slug) VALUES
('c2a44f6f-7b31-4b6a-a23d-6e1b8f3e5e7d', 'English', 'EN');

INSERT OR IGNORE INTO verb_tenses (id, language_id, name) VALUES
('a1b2c3d4-e5f6-7890-1234-56789abcdef0', 'c2a44f6f-7b31-4b6a-a23d-6e1b8f3e5e7d', 'Present Simple'),
('b2c3d4e5-f678-9012-3456-789abcdef012', 'c2a44f6f-7b31-4b6a-a23d-6e1b8f3e5e7d', 'Present Continuous'),
('c3d4e5f6-7890-1234-5678-9abcdef01234', 'c2a44f6f-7b31-4b6a-a23d-6e1b8f3e5e7d', 'Present Perfect'),
('d4e5f678-9012-3456-789a-bcdef0123456', 'c2a44f6f-7b31-4b6a-a23d-6e1b8f3e5e7d', 'Past Simple'),
('e5f67890-1234-5678-9abc-def012345678', 'c2a44f6f-7b31-4b6a-a23d-6e1b8f3e5e7d', 'Past Continuous'),
('f6789012-3456-789a-bcde-f01234567890', 'c2a44f6f-7b31-4b6a-a23d-6e1b8f3e5e7d', 'Past Perfect'),
('67890123-4567-89ab-cdef-0123456789ab', 'c2a44f6f-7b31-4b6a-a23d-6e1b8f3e5e7d', 'Future Simple'),
('78901234-5678-9abc-def0-123456789abc', 'c2a44f6f-7b31-4b6a-a23d-6e1b8f3e5e7d', 'Future Continuous'),
('89012345-6789-abcd-ef01-23456789abcd', 'c2a44f6f-7b31-4b6a-a23d-6e1b8f3e5e7d', 'Future Perfect');

`;
