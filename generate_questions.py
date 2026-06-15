import json
import random
import os

# Ensure directory exists
os.makedirs('c:/Users/LENOVO/Downloads/highway/src/data', exist_ok=True)

questions = []
id_counter = 1

# Grammar
grammar_prompts = [
    ("Choose the correct word.", ["go", "gone", "went", "going"], 2),
    ("Select the right auxiliary.", ["has", "have", "had", "having"], 1),
    ("Complete the conditional.", ["was", "am", "were", "be"], 2),
    ("Pick the right preposition.", ["in", "on", "at", "to"], 0),
    ("Identify the correct tense.", ["running", "ran", "runs", "run"], 1)
]

for i in range(30):
    q_type = random.choice(['multiple_choice', 'drag_and_drop', 'matching', 'multiple_select'])
    if q_type == 'multiple_choice':
        p = random.choice(grammar_prompts)
        questions.append({
            "id": id_counter, "type": "multiple_choice", "skill": "Grammar & Vocabulary",
            "question": p[0], "options": p[1], "correctOption": p[2]
        })
    elif q_type == 'drag_and_drop':
        questions.append({
            "id": id_counter, "type": "drag_and_drop", "skill": "Grammar & Vocabulary",
            "question": "Arrange the words to form a correct sentence:",
            "draggableItems": ["always", "in", "it", "rains", "winter"], "correctOrder": ["it", "always", "rains", "in", "winter"]
        })
    elif q_type == 'matching':
        questions.append({
            "id": id_counter, "type": "matching", "skill": "Grammar & Vocabulary",
            "question": "Match the words with their synonyms:",
            "leftItems": [{"id":"l1","text":"Abundant"}, {"id":"l2","text":"Obsolete"}],
            "rightItems": [{"id":"r1","text":"Outdated"}, {"id":"r2","text":"Plentiful"}],
            "correctMatches": {"l1":"r2", "l2":"r1"}
        })
    elif q_type == 'multiple_select':
        questions.append({
            "id": id_counter, "type": "multiple_select", "skill": "Grammar & Vocabulary",
            "question": "Select ALL the verbs from the list below:",
            "options": ["Analyze", "Beautiful", "Construct", "Rapidly"], "correctOptions": [0, 2]
        })
    id_counter += 1

# Reading
reading_passages = [
    ("The phenomenon of urban sprawl has led to numerous environmental issues. Natural habitats are destroyed.", "What is a negative result of urban expansion?", ["A reduction in wildlife", "Increase in farming", "Better transport", "More cities"], 0),
    ("While advocates for green energy emphasize its long-term ecological advantages, skeptics highlight that solar and wind sources are dependent on weather.", "What is the primary concern raised?", ["Cost", "Inconsistency", "Pollution", "Land use"], 1)
]

for i in range(15):
    q_type = random.choice(['multiple_choice', 'true_false'])
    p = random.choice(reading_passages)
    if q_type == 'multiple_choice':
        questions.append({
            "id": id_counter, "type": "multiple_choice", "skill": "Reading",
            "passage": p[0], "question": p[1], "options": p[2], "correctOption": p[3]
        })
    else:
        questions.append({
            "id": id_counter, "type": "true_false", "skill": "Reading",
            "passage": p[0], "question": "The text states that there are environmental issues.",
            "options": ["True", "False", "Not Given"], "correctOption": 0
        })
    id_counter += 1

# Listening
listening_audios = [
    ("Although the project was highly challenging, the team managed to complete it ahead of schedule.", "How did the team finish the project?", ["They worked slowly", "Through exceptional collaboration", "Ahead of schedule", "They failed"], 2),
    ("Please ensure that the reports are submitted by the end of the day.", "When are the reports due?", ["Tomorrow", "End of the week", "End of the day", "Next month"], 2)
]

for i in range(25):
    q_type = random.choice(['multiple_choice', 'text_input', 'true_false'])
    a = random.choice(listening_audios)
    if q_type == 'multiple_choice':
        questions.append({
            "id": id_counter, "type": "multiple_choice", "skill": "Listening",
            "audioText": a[0], "question": a[1], "options": a[2], "correctOption": a[3]
        })
    elif q_type == 'text_input':
        questions.append({
            "id": id_counter, "type": "text_input", "skill": "Listening",
            "audioText": "The weather is very beautiful today.",
            "question": "Listen and type the missing word: The weather is very ________ today.",
            "correctText": ["beautiful"]
        })
    else:
        questions.append({
            "id": id_counter, "type": "true_false", "skill": "Listening",
            "audioText": a[0], "question": "The speaker is giving a strict deadline.",
            "options": ["True", "False", "Not Given"], "correctOption": 0
        })
    id_counter += 1

# Writing
writing_prompts = [
    ("Write the plural form of the word 'child'.", "children"),
    ("Write the past tense of the verb 'to eat'.", "ate"),
    ("Fill in the blank: They are ____ football right now.", "playing")
]

for i in range(25):
    q_type = random.choice(['text_input', 'drag_and_drop'])
    if q_type == 'text_input':
        w = random.choice(writing_prompts)
        questions.append({
            "id": id_counter, "type": "text_input", "skill": "Writing",
            "question": w[0], "correctText": [w[1]]
        })
    else:
        questions.append({
            "id": id_counter, "type": "drag_and_drop", "skill": "Writing",
            "question": "Structure the sentence correctly:",
            "draggableItems": ["I", "have", "never", "seen", "it"], "correctOrder": ["I", "have", "never", "seen", "it"]
        })
    id_counter += 1

ts_code = f'''export type QuestionType = 'multiple_choice' | 'text_input' | 'drag_and_drop' | 'matching' | 'true_false' | 'multiple_select';
export type SkillType = 'Grammar & Vocabulary' | 'Reading' | 'Listening' | 'Writing';

export interface Question {{
  id: number;
  type: QuestionType;
  skill: SkillType;
  question: string;
  passage?: string;
  audioText?: string;
  options?: string[];
  correctOption?: number;
  correctOptions?: number[];
  correctText?: string[];
  draggableItems?: string[];
  correctOrder?: string[];
  leftItems?: {{ id: string, text: string }}[];
  rightItems?: {{ id: string, text: string }}[];
  correctMatches?: Record<string, string>;
}}

export const ALL_QUESTIONS: Question[] = {json.dumps(questions, indent=2)};
'''

with open('c:/Users/LENOVO/Downloads/highway/src/data/questions.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)
