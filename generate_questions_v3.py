import json
import os
import random

# Ensure directory exists
os.makedirs('c:/Users/LENOVO/Downloads/highway/src/data', exist_ok=True)

grammar_questions = []
reading_questions = []
listening_questions = []
writing_questions = []

# --- 30 GRAMMAR & VOCABULARY ---
grammar_list = [
    {"q": "I ______ to the cinema yesterday.", "type": "multiple_choice", "opts": ["go", "gone", "went", "going"], "ans": 2},
    {"q": "He doesn't ______ any siblings.", "type": "multiple_choice", "opts": ["has", "have", "had", "having"], "ans": 1},
    {"q": "If I ______ you, I would study harder.", "type": "multiple_choice", "opts": ["was", "am", "were", "be"], "ans": 2},
    {"q": "The cost of living has ______ dramatically.", "type": "multiple_choice", "opts": ["raised", "risen", "arise", "lifted"], "ans": 1},
    {"q": "No sooner ______ the house than it started raining.", "type": "multiple_choice", "opts": ["I had left", "had I left", "I left", "did I leave"], "ans": 1},
    {"q": "She is used to ______ early.", "type": "multiple_choice", "opts": ["wake up", "waking up", "woke up", "waken up"], "ans": 1},
    {"q": "By this time next year, I ______ my degree.", "type": "multiple_choice", "opts": ["will finish", "will have finished", "finished", "finish"], "ans": 1},
    {"q": "I wish I ______ more time.", "type": "multiple_choice", "opts": ["have", "has", "had", "having"], "ans": 2},
    {"q": "You ______ better see a doctor.", "type": "multiple_choice", "opts": ["had", "have", "would", "should"], "ans": 0},
    {"q": "She is the ______ girl in the class.", "type": "multiple_choice", "opts": ["tall", "taller", "tallest", "most tall"], "ans": 2},
    {"q": "I look forward to ______ from you.", "type": "multiple_choice", "opts": ["hear", "hearing", "heard", "hears"], "ans": 1},
    {"q": "The house was built ______ 1990.", "type": "multiple_choice", "opts": ["in", "on", "at", "by"], "ans": 0},
    {"q": "She ______ on the phone when I arrived.", "type": "multiple_choice", "opts": ["talked", "is talking", "was talking", "talks"], "ans": 2},
    {"q": "I have lived here ______ five years.", "type": "multiple_choice", "opts": ["since", "for", "in", "from"], "ans": 1},
    {"q": "Select ALL the modal verbs:", "type": "multiple_select", "opts": ["Can", "Jump", "Must", "Blue"], "ans": [0, 2]},
    {"q": "Select ALL the adjectives:", "type": "multiple_select", "opts": ["Quickly", "Beautiful", "Smart", "Run"], "ans": [1, 2]},
    {"q": "Select ALL the nouns:", "type": "multiple_select", "opts": ["Apple", "Eat", "Car", "Fast"], "ans": [0, 2]},
    {"q": "Select ALL the adverbs:", "type": "multiple_select", "opts": ["Slowly", "Happy", "Carefully", "Book"], "ans": [0, 2]},
    {"q": "Select ALL the pronouns:", "type": "multiple_select", "opts": ["He", "They", "Table", "Green"], "ans": [0, 1]},
    {"q": "Select ALL the conjunctions:", "type": "multiple_select", "opts": ["And", "But", "Dog", "Go"], "ans": [0, 1]},
    {"q": "Arrange the sentence:", "type": "drag_and_drop", "drag": ["always", "in", "it", "rains", "winter"], "ans": ["it", "always", "rains", "in", "winter"]},
    {"q": "Arrange the sentence:", "type": "drag_and_drop", "drag": ["have", "I", "never", "seen", "it"], "ans": ["I", "have", "never", "seen", "it"]},
    {"q": "Arrange the sentence:", "type": "drag_and_drop", "drag": ["what", "time", "is", "it", "now"], "ans": ["what", "time", "is", "it", "now"]},
    {"q": "Arrange the sentence:", "type": "drag_and_drop", "drag": ["where", "do", "you", "live"], "ans": ["where", "do", "you", "live"]},
    {"q": "Arrange the sentence:", "type": "drag_and_drop", "drag": ["how", "are", "you", "doing", "today"], "ans": ["how", "are", "you", "doing", "today"]},
    {"q": "Match synonyms:", "type": "matching", "left": [{"id":"l1","text":"Big"}, {"id":"l2","text":"Fast"}], "right": [{"id":"r1","text":"Quick"}, {"id":"r2","text":"Large"}], "ans": {"l1":"r2", "l2":"r1"}},
    {"q": "Match antonyms:", "type": "matching", "left": [{"id":"l1","text":"Hot"}, {"id":"l2","text":"Good"}], "right": [{"id":"r1","text":"Bad"}, {"id":"r2","text":"Cold"}], "ans": {"l1":"r2", "l2":"r1"}},
    {"q": "Match words to categories:", "type": "matching", "left": [{"id":"l1","text":"Apple"}, {"id":"l2","text":"Car"}], "right": [{"id":"r1","text":"Vehicle"}, {"id":"r2","text":"Fruit"}], "ans": {"l1":"r2", "l2":"r1"}},
    {"q": "Match phrasal verbs:", "type": "matching", "left": [{"id":"l1","text":"Give up"}, {"id":"l2","text":"Put off"}], "right": [{"id":"r1","text":"Postpone"}, {"id":"r2","text":"Quit"}], "ans": {"l1":"r2", "l2":"r1"}},
    {"q": "Match animals:", "type": "matching", "left": [{"id":"l1","text":"Dog"}, {"id":"l2","text":"Cat"}], "right": [{"id":"r1","text":"Meow"}, {"id":"r2","text":"Bark"}], "ans": {"l1":"r2", "l2":"r1"}}
]

for g in grammar_list:
    q = {"skill": "Grammar & Vocabulary", "question": g["q"], "type": g["type"]}
    if g["type"] == "multiple_choice":
        q["options"] = g["opts"]
        q["correctOption"] = g["ans"]
    elif g["type"] == "multiple_select":
        q["options"] = g["opts"]
        q["correctOptions"] = g["ans"]
    elif g["type"] == "drag_and_drop":
        q["draggableItems"] = g["drag"]
        q["correctOrder"] = g["ans"]
    elif g["type"] == "matching":
        q["leftItems"] = g["left"]
        q["rightItems"] = g["right"]
        q["correctMatches"] = g["ans"]
    grammar_questions.append(q)

# --- 15 READING ---
reading_list = [
    {"q": "What is the name of John's dog?", "p": "My name is John. I have a dog named Max.", "type": "multiple_choice", "opts": ["Max", "John", "Teacher", "Dog"], "ans": 0},
    {"q": "What does the family do in the summer?", "p": "Every summer, my family goes to the beach. We swim in the sea.", "type": "multiple_choice", "opts": ["Go skiing", "Go to the beach", "Stay at home", "Visit the mountains"], "ans": 1},
    {"q": "Where does Maria volunteer?", "p": "Maria loves animals. Every weekend, she volunteers at the local animal shelter.", "type": "multiple_choice", "opts": ["At the pet store", "At the animal shelter", "At the clinic", "At the park"], "ans": 1},
    {"q": "Where is the coffee shop located?", "p": "The library has three floors and a coffee shop on the ground floor.", "type": "multiple_choice", "opts": ["On the second floor", "On the top floor", "Outside", "On the ground floor"], "ans": 3},
    {"q": "Why didn't Mark pay?", "p": "Mark waited in line but discovered he had left his money at home.", "type": "multiple_choice", "opts": ["Machine was broken", "He had no money", "He changed his mind", "Refused service"], "ans": 1},
    {"q": "What does cooking require?", "p": "Cooking is an art form that requires intuition and creativity.", "type": "multiple_choice", "opts": ["Only ingredients", "Intuition and creativity", "A large kitchen", "Expensive tools"], "ans": 1},
    {"q": "How did the audience react?", "p": "Despite the rain, the concert continued, to the delight of the audience.", "type": "multiple_choice", "opts": ["They were angry", "They were delighted", "They left early", "They were confused"], "ans": 1},
    {"q": "What is a negative result of urban expansion?", "p": "As cities expand, forests are paved over, leaving species without homes.", "type": "multiple_choice", "opts": ["Reduction in wildlife", "Increase in farming", "New wetlands", "Improved conditions"], "ans": 0},
    {"q": "The skeptics are concerned about weather dependency.", "p": "Skeptics highlight that solar and wind sources are dependent on weather.", "type": "true_false", "opts": ["True", "False", "Not Given"], "ans": 0},
    {"q": "Smartphones eliminate isolation entirely.", "p": "Smartphones have led to a paradox where connectivity breeds profound isolation.", "type": "true_false", "opts": ["True", "False", "Not Given"], "ans": 1},
    {"q": "The Earth orbits the Moon.", "p": "The Earth revolves around the Sun in an elliptical orbit.", "type": "true_false", "opts": ["True", "False", "Not Given"], "ans": 1},
    {"q": "Water boils at 50 degrees Celsius.", "p": "Under standard atmospheric pressure, water boils at 100 degrees Celsius.", "type": "true_false", "opts": ["True", "False", "Not Given"], "ans": 1},
    {"q": "Einstein won a Nobel Prize.", "p": "Albert Einstein was awarded the 1921 Nobel Prize in Physics.", "type": "true_false", "opts": ["True", "False", "Not Given"], "ans": 0},
    {"q": "The capital of France is Rome.", "p": "Paris is the capital and most populous city of France.", "type": "true_false", "opts": ["True", "False", "Not Given"], "ans": 1},
    {"q": "The passage discusses the invention of the telephone.", "p": "Alexander Graham Bell is credited with patenting the first practical telephone.", "type": "true_false", "opts": ["True", "False", "Not Given"], "ans": 0}
]

for r in reading_list:
    q = {"skill": "Reading", "question": r["q"], "passage": r["p"], "type": r["type"], "options": r["opts"], "correctOption": r["ans"]}
    reading_questions.append(q)

# --- 25 LISTENING ---
listening_list = [
    {"q": "What is her name?", "a": "Hello, my name is Anna.", "type": "multiple_choice", "opts": ["Sarah", "Anna", "Emma", "Laura"], "ans": 1},
    {"q": "Where is the cat?", "a": "The cat is sleeping on the sofa.", "type": "multiple_choice", "opts": ["On the bed", "Under the table", "On the sofa", "Outside"], "ans": 2},
    {"q": "What does the person want to drink?", "a": "I would like a cup of coffee, please.", "type": "multiple_choice", "opts": ["Tea", "Water", "Juice", "Coffee"], "ans": 3},
    {"q": "What is the correct response?", "a": "Good morning. How are you today?", "type": "multiple_choice", "opts": ["I am fine, thank you.", "It is a nice day.", "Goodbye.", "I am going to school."], "ans": 0},
    {"q": "When are the reports due?", "a": "Please ensure the reports are submitted by the end of the day.", "type": "multiple_choice", "opts": ["Tomorrow", "End of the week", "End of the day", "Next month"], "ans": 2},
    {"q": "How did the team finish?", "a": "The team managed to complete it ahead of schedule.", "type": "multiple_choice", "opts": ["Worked slowly", "Ahead of schedule", "Skipped parts", "Failed"], "ans": 1},
    {"q": "What does the speaker imply?", "a": "His media presence was a product of relentless self-promotion.", "type": "multiple_choice", "opts": ["Highly respected", "True expert", "Promotes himself", "Avoids media"], "ans": 2},
    {"q": "How did the audience react?", "a": "The subtle nuances were entirely lost on the hostile audience.", "type": "multiple_choice", "opts": ["Understood perfectly", "Missed the nuances", "Agreed", "Interrupted"], "ans": 1},
    {"q": "What is the weather like?", "a": "It is raining heavily outside.", "type": "multiple_choice", "opts": ["Sunny", "Raining", "Snowing", "Windy"], "ans": 1},
    {"q": "What color is the car?", "a": "He drives a bright red car.", "type": "multiple_choice", "opts": ["Blue", "Red", "Green", "Black"], "ans": 1},
    {"q": "The speaker is tired.", "a": "I am feeling extremely exhausted today.", "type": "true_false", "opts": ["True", "False", "Not Given"], "ans": 0},
    {"q": "The train leaves at 5 PM.", "a": "The train departs exactly at five o'clock in the evening.", "type": "true_false", "opts": ["True", "False", "Not Given"], "ans": 0},
    {"q": "The store is closed.", "a": "Welcome! We are open 24 hours a day.", "type": "true_false", "opts": ["True", "False", "Not Given"], "ans": 1},
    {"q": "She likes spicy food.", "a": "I absolutely hate anything with chili in it.", "type": "true_false", "opts": ["True", "False", "Not Given"], "ans": 1},
    {"q": "He is a doctor.", "a": "I have been working as an engineer for ten years.", "type": "true_false", "opts": ["True", "False", "Not Given"], "ans": 1},
    {"q": "Listen and type the missing word: The weather is very ________ today.", "a": "The weather is very beautiful today.", "type": "text_input", "ans": ["beautiful"]},
    {"q": "Listen and type the missing word: Don't forget to buy some ________.", "a": "Don't forget to buy some apples.", "type": "text_input", "ans": ["apples"]},
    {"q": "Listen and type the missing word: My favorite color is ________.", "a": "My favorite color is blue.", "type": "text_input", "ans": ["blue"]},
    {"q": "Listen and type the missing word: I have a meeting at ________ o'clock.", "a": "I have a meeting at three o'clock.", "type": "text_input", "ans": ["three"]},
    {"q": "Listen and type the missing word: She is reading a ________.", "a": "She is reading a book.", "type": "text_input", "ans": ["book"]},
    {"q": "Listen and type the missing word: We need to buy more ________.", "a": "We need to buy more bread.", "type": "text_input", "ans": ["bread"]},
    {"q": "Listen and type the missing word: He plays the ________ very well.", "a": "He plays the piano very well.", "type": "text_input", "ans": ["piano"]},
    {"q": "Listen and type the missing word: They live in a large ________.", "a": "They live in a large house.", "type": "text_input", "ans": ["house"]},
    {"q": "Listen and type the missing word: I want to learn ________.", "a": "I want to learn English.", "type": "text_input", "ans": ["english"]},
    {"q": "Listen and type the missing word: The dog is ________ loudly.", "a": "The dog is barking loudly.", "type": "text_input", "ans": ["barking"]}
]

for l in listening_list:
    q = {"skill": "Listening", "question": l["q"], "audioText": l["a"], "type": l["type"]}
    if l["type"] == "multiple_choice" or l["type"] == "true_false":
        q["options"] = l["opts"]
        q["correctOption"] = l["ans"]
    elif l["type"] == "text_input":
        q["correctText"] = l["ans"]
    listening_questions.append(q)

# --- 25 WRITING ---
writing_list = [
    {"q": "Write the plural form of 'child'.", "type": "text_input", "ans": ["children"]},
    {"q": "Write the past tense of 'to eat'.", "type": "text_input", "ans": ["ate"]},
    {"q": "They are ____ football right now. (missing word)", "type": "text_input", "ans": ["playing"]},
    {"q": "I have lived here _____ 2010. (preposition)", "type": "text_input", "ans": ["since"]},
    {"q": "We ____ going to the beach tomorrow.", "type": "text_input", "ans": ["are"]},
    {"q": "By the time we arrived, the movie ____ finished.", "type": "text_input", "ans": ["had"]},
    {"q": "Neither of the students ____ finished.", "type": "text_input", "ans": ["has"]},
    {"q": "10-letter word starting with 'i' meaning impossible to prevent.", "type": "text_input", "ans": ["inevitable"]},
    {"q": "It is essential that he ____ immediately.", "type": "text_input", "ans": ["leave"]},
    {"q": "5-letter synonym for quick starting with r.", "type": "text_input", "ans": ["rapid"]},
    {"q": "Write the plural of 'mouse'.", "type": "text_input", "ans": ["mice"]},
    {"q": "Write the past participle of 'go'.", "type": "text_input", "ans": ["gone"]},
    {"q": "She ____ a letter to her friend yesterday.", "type": "text_input", "ans": ["wrote"]},
    {"q": "He is the ____ intelligent student in the class.", "type": "text_input", "ans": ["most"]},
    {"q": "I look forward to ____ you soon.", "type": "text_input", "ans": ["seeing"]},
    {"q": "Structure the sentence:", "type": "drag_and_drop", "drag": ["I", "love", "learning", "English"], "ans": ["I", "love", "learning", "English"]},
    {"q": "Structure the sentence:", "type": "drag_and_drop", "drag": ["He", "went", "to", "the", "store"], "ans": ["He", "went", "to", "the", "store"]},
    {"q": "Structure the sentence:", "type": "drag_and_drop", "drag": ["They", "are", "playing", "soccer", "now"], "ans": ["They", "are", "playing", "soccer", "now"]},
    {"q": "Structure the sentence:", "type": "drag_and_drop", "drag": ["She", "has", "already", "eaten", "breakfast"], "ans": ["She", "has", "already", "eaten", "breakfast"]},
    {"q": "Structure the sentence:", "type": "drag_and_drop", "drag": ["What", "are", "you", "doing", "here"], "ans": ["What", "are", "you", "doing", "here"]},
    {"q": "Structure the sentence:", "type": "drag_and_drop", "drag": ["It", "is", "raining", "very", "hard"], "ans": ["It", "is", "raining", "very", "hard"]},
    {"q": "Structure the sentence:", "type": "drag_and_drop", "drag": ["The", "cat", "is", "on", "the", "table"], "ans": ["The", "cat", "is", "on", "the", "table"]},
    {"q": "Structure the sentence:", "type": "drag_and_drop", "drag": ["I", "will", "call", "you", "later"], "ans": ["I", "will", "call", "you", "later"]},
    {"q": "Structure the sentence:", "type": "drag_and_drop", "drag": ["We", "should", "go", "home", "now"], "ans": ["We", "should", "go", "home", "now"]},
    {"q": "Structure the sentence:", "type": "drag_and_drop", "drag": ["Do", "you", "like", "drinking", "coffee"], "ans": ["Do", "you", "like", "drinking", "coffee"]}
]

for w in writing_list:
    q = {"skill": "Writing", "question": w["q"], "type": w["type"]}
    if w["type"] == "text_input":
        q["correctText"] = w["ans"]
    elif w["type"] == "drag_and_drop":
        q["draggableItems"] = w["drag"]
        q["correctOrder"] = w["ans"]
    writing_questions.append(q)

# Shuffle within skills to mix question types
random.seed(42) # Optional: keep it reproducible or not. Let's not use a seed to make it random.
random.shuffle(grammar_questions)
random.shuffle(reading_questions)
random.shuffle(listening_questions)
random.shuffle(writing_questions)

all_qs = grammar_questions + reading_questions + listening_questions + writing_questions
final_qs = []
id_counter = 1
for q in all_qs:
    q['id'] = id_counter
    final_qs.append(q)
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

export const ALL_QUESTIONS: Question[] = {json.dumps(final_qs, indent=2)};
'''

with open('c:/Users/LENOVO/Downloads/highway/src/data/questions.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)
