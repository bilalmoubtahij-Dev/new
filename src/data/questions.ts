export type QuestionType = 'multiple_choice' | 'text_input' | 'drag_and_drop' | 'matching' | 'true_false' | 'multiple_select';
export type SkillType = 'Grammar & Vocabulary' | 'Reading' | 'Listening' | 'Writing';

export interface Question {
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
  leftItems?: { id: string, text: string }[];
  rightItems?: { id: string, text: string }[];
  correctMatches?: Record<string, string>;
}

export const ALL_QUESTIONS: Question[] = [
  {
    "skill": "Grammar & Vocabulary",
    "question": "Select ALL the conjunctions:",
    "type": "multiple_select",
    "options": [
      "And",
      "But",
      "Dog",
      "Go"
    ],
    "correctOptions": [
      0,
      1
    ],
    "id": 1
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "Select ALL the modal verbs:",
    "type": "multiple_select",
    "options": [
      "Can",
      "Jump",
      "Must",
      "Blue"
    ],
    "correctOptions": [
      0,
      2
    ],
    "id": 2
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "I look forward to ______ from you.",
    "type": "multiple_choice",
    "options": [
      "hear",
      "hearing",
      "heard",
      "hears"
    ],
    "correctOption": 1,
    "id": 3
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "Match antonyms:",
    "type": "matching",
    "leftItems": [
      {
        "id": "l1",
        "text": "Hot"
      },
      {
        "id": "l2",
        "text": "Good"
      }
    ],
    "rightItems": [
      {
        "id": "r1",
        "text": "Bad"
      },
      {
        "id": "r2",
        "text": "Cold"
      }
    ],
    "correctMatches": {
      "l1": "r2",
      "l2": "r1"
    },
    "id": 4
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "Arrange the sentence:",
    "type": "drag_and_drop",
    "draggableItems": [
      "what",
      "time",
      "is",
      "it",
      "now"
    ],
    "correctOrder": [
      "what",
      "time",
      "is",
      "it",
      "now"
    ],
    "id": 5
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "By this time next year, I ______ my degree.",
    "type": "multiple_choice",
    "options": [
      "will finish",
      "will have finished",
      "finished",
      "finish"
    ],
    "correctOption": 1,
    "id": 6
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "She is used to ______ early.",
    "type": "multiple_choice",
    "options": [
      "wake up",
      "waking up",
      "woke up",
      "waken up"
    ],
    "correctOption": 1,
    "id": 7
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "She ______ on the phone when I arrived.",
    "type": "multiple_choice",
    "options": [
      "talked",
      "is talking",
      "was talking",
      "talks"
    ],
    "correctOption": 2,
    "id": 8
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "The house was built ______ 1990.",
    "type": "multiple_choice",
    "options": [
      "in",
      "on",
      "at",
      "by"
    ],
    "correctOption": 0,
    "id": 9
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "Select ALL the adjectives:",
    "type": "multiple_select",
    "options": [
      "Quickly",
      "Beautiful",
      "Smart",
      "Run"
    ],
    "correctOptions": [
      1,
      2
    ],
    "id": 10
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "She is the ______ girl in the class.",
    "type": "multiple_choice",
    "options": [
      "tall",
      "taller",
      "tallest",
      "most tall"
    ],
    "correctOption": 2,
    "id": 11
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "Match synonyms:",
    "type": "matching",
    "leftItems": [
      {
        "id": "l1",
        "text": "Big"
      },
      {
        "id": "l2",
        "text": "Fast"
      }
    ],
    "rightItems": [
      {
        "id": "r1",
        "text": "Quick"
      },
      {
        "id": "r2",
        "text": "Large"
      }
    ],
    "correctMatches": {
      "l1": "r2",
      "l2": "r1"
    },
    "id": 12
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "Match animals:",
    "type": "matching",
    "leftItems": [
      {
        "id": "l1",
        "text": "Dog"
      },
      {
        "id": "l2",
        "text": "Cat"
      }
    ],
    "rightItems": [
      {
        "id": "r1",
        "text": "Meow"
      },
      {
        "id": "r2",
        "text": "Bark"
      }
    ],
    "correctMatches": {
      "l1": "r2",
      "l2": "r1"
    },
    "id": 13
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "Arrange the sentence:",
    "type": "drag_and_drop",
    "draggableItems": [
      "have",
      "I",
      "never",
      "seen",
      "it"
    ],
    "correctOrder": [
      "I",
      "have",
      "never",
      "seen",
      "it"
    ],
    "id": 14
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "Select ALL the nouns:",
    "type": "multiple_select",
    "options": [
      "Apple",
      "Eat",
      "Car",
      "Fast"
    ],
    "correctOptions": [
      0,
      2
    ],
    "id": 15
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "Match words to categories:",
    "type": "matching",
    "leftItems": [
      {
        "id": "l1",
        "text": "Apple"
      },
      {
        "id": "l2",
        "text": "Car"
      }
    ],
    "rightItems": [
      {
        "id": "r1",
        "text": "Vehicle"
      },
      {
        "id": "r2",
        "text": "Fruit"
      }
    ],
    "correctMatches": {
      "l1": "r2",
      "l2": "r1"
    },
    "id": 16
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "He doesn't ______ any siblings.",
    "type": "multiple_choice",
    "options": [
      "has",
      "have",
      "had",
      "having"
    ],
    "correctOption": 1,
    "id": 17
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "I have lived here ______ five years.",
    "type": "multiple_choice",
    "options": [
      "since",
      "for",
      "in",
      "from"
    ],
    "correctOption": 1,
    "id": 18
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "Select ALL the pronouns:",
    "type": "multiple_select",
    "options": [
      "He",
      "They",
      "Table",
      "Green"
    ],
    "correctOptions": [
      0,
      1
    ],
    "id": 19
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "If I ______ you, I would study harder.",
    "type": "multiple_choice",
    "options": [
      "was",
      "am",
      "were",
      "be"
    ],
    "correctOption": 2,
    "id": 20
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "Select ALL the adverbs:",
    "type": "multiple_select",
    "options": [
      "Slowly",
      "Happy",
      "Carefully",
      "Book"
    ],
    "correctOptions": [
      0,
      2
    ],
    "id": 21
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "Match phrasal verbs:",
    "type": "matching",
    "leftItems": [
      {
        "id": "l1",
        "text": "Give up"
      },
      {
        "id": "l2",
        "text": "Put off"
      }
    ],
    "rightItems": [
      {
        "id": "r1",
        "text": "Postpone"
      },
      {
        "id": "r2",
        "text": "Quit"
      }
    ],
    "correctMatches": {
      "l1": "r2",
      "l2": "r1"
    },
    "id": 22
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "No sooner ______ the house than it started raining.",
    "type": "multiple_choice",
    "options": [
      "I had left",
      "had I left",
      "I left",
      "did I leave"
    ],
    "correctOption": 1,
    "id": 23
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "Arrange the sentence:",
    "type": "drag_and_drop",
    "draggableItems": [
      "how",
      "are",
      "you",
      "doing",
      "today"
    ],
    "correctOrder": [
      "how",
      "are",
      "you",
      "doing",
      "today"
    ],
    "id": 24
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "I wish I ______ more time.",
    "type": "multiple_choice",
    "options": [
      "have",
      "has",
      "had",
      "having"
    ],
    "correctOption": 2,
    "id": 25
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "You ______ better see a doctor.",
    "type": "multiple_choice",
    "options": [
      "had",
      "have",
      "would",
      "should"
    ],
    "correctOption": 0,
    "id": 26
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "Arrange the sentence:",
    "type": "drag_and_drop",
    "draggableItems": [
      "where",
      "do",
      "you",
      "live"
    ],
    "correctOrder": [
      "where",
      "do",
      "you",
      "live"
    ],
    "id": 27
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "I ______ to the cinema yesterday.",
    "type": "multiple_choice",
    "options": [
      "go",
      "gone",
      "went",
      "going"
    ],
    "correctOption": 2,
    "id": 28
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "The cost of living has ______ dramatically.",
    "type": "multiple_choice",
    "options": [
      "raised",
      "risen",
      "arise",
      "lifted"
    ],
    "correctOption": 1,
    "id": 29
  },
  {
    "skill": "Grammar & Vocabulary",
    "question": "Arrange the sentence:",
    "type": "drag_and_drop",
    "draggableItems": [
      "always",
      "in",
      "it",
      "rains",
      "winter"
    ],
    "correctOrder": [
      "it",
      "always",
      "rains",
      "in",
      "winter"
    ],
    "id": 30
  },
  {
    "skill": "Reading",
    "question": "What is a negative result of urban expansion?",
    "passage": "As cities expand, forests are paved over, leaving species without homes.",
    "type": "multiple_choice",
    "options": [
      "Reduction in wildlife",
      "Increase in farming",
      "New wetlands",
      "Improved conditions"
    ],
    "correctOption": 0,
    "id": 31
  },
  {
    "skill": "Reading",
    "question": "The skeptics are concerned about weather dependency.",
    "passage": "Skeptics highlight that solar and wind sources are dependent on weather.",
    "type": "true_false",
    "options": [
      "True",
      "False",
      "Not Given"
    ],
    "correctOption": 0,
    "id": 32
  },
  {
    "skill": "Reading",
    "question": "Where is the coffee shop located?",
    "passage": "The library has three floors and a coffee shop on the ground floor.",
    "type": "multiple_choice",
    "options": [
      "On the second floor",
      "On the top floor",
      "Outside",
      "On the ground floor"
    ],
    "correctOption": 3,
    "id": 33
  },
  {
    "skill": "Reading",
    "question": "Water boils at 50 degrees Celsius.",
    "passage": "Under standard atmospheric pressure, water boils at 100 degrees Celsius.",
    "type": "true_false",
    "options": [
      "True",
      "False",
      "Not Given"
    ],
    "correctOption": 1,
    "id": 34
  },
  {
    "skill": "Reading",
    "question": "The Earth orbits the Moon.",
    "passage": "The Earth revolves around the Sun in an elliptical orbit.",
    "type": "true_false",
    "options": [
      "True",
      "False",
      "Not Given"
    ],
    "correctOption": 1,
    "id": 35
  },
  {
    "skill": "Reading",
    "question": "The passage discusses the invention of the telephone.",
    "passage": "Alexander Graham Bell is credited with patenting the first practical telephone.",
    "type": "true_false",
    "options": [
      "True",
      "False",
      "Not Given"
    ],
    "correctOption": 0,
    "id": 36
  },
  {
    "skill": "Reading",
    "question": "What does the family do in the summer?",
    "passage": "Every summer, my family goes to the beach. We swim in the sea.",
    "type": "multiple_choice",
    "options": [
      "Go skiing",
      "Go to the beach",
      "Stay at home",
      "Visit the mountains"
    ],
    "correctOption": 1,
    "id": 37
  },
  {
    "skill": "Reading",
    "question": "The capital of France is Rome.",
    "passage": "Paris is the capital and most populous city of France.",
    "type": "true_false",
    "options": [
      "True",
      "False",
      "Not Given"
    ],
    "correctOption": 1,
    "id": 38
  },
  {
    "skill": "Reading",
    "question": "What does cooking require?",
    "passage": "Cooking is an art form that requires intuition and creativity.",
    "type": "multiple_choice",
    "options": [
      "Only ingredients",
      "Intuition and creativity",
      "A large kitchen",
      "Expensive tools"
    ],
    "correctOption": 1,
    "id": 39
  },
  {
    "skill": "Reading",
    "question": "How did the audience react?",
    "passage": "Despite the rain, the concert continued, to the delight of the audience.",
    "type": "multiple_choice",
    "options": [
      "They were angry",
      "They were delighted",
      "They left early",
      "They were confused"
    ],
    "correctOption": 1,
    "id": 40
  },
  {
    "skill": "Reading",
    "question": "Where does Maria volunteer?",
    "passage": "Maria loves animals. Every weekend, she volunteers at the local animal shelter.",
    "type": "multiple_choice",
    "options": [
      "At the pet store",
      "At the animal shelter",
      "At the clinic",
      "At the park"
    ],
    "correctOption": 1,
    "id": 41
  },
  {
    "skill": "Reading",
    "question": "What is the name of John's dog?",
    "passage": "My name is John. I have a dog named Max.",
    "type": "multiple_choice",
    "options": [
      "Max",
      "John",
      "Teacher",
      "Dog"
    ],
    "correctOption": 0,
    "id": 42
  },
  {
    "skill": "Reading",
    "question": "Einstein won a Nobel Prize.",
    "passage": "Albert Einstein was awarded the 1921 Nobel Prize in Physics.",
    "type": "true_false",
    "options": [
      "True",
      "False",
      "Not Given"
    ],
    "correctOption": 0,
    "id": 43
  },
  {
    "skill": "Reading",
    "question": "Why didn't Mark pay?",
    "passage": "Mark waited in line but discovered he had left his money at home.",
    "type": "multiple_choice",
    "options": [
      "Machine was broken",
      "He had no money",
      "He changed his mind",
      "Refused service"
    ],
    "correctOption": 1,
    "id": 44
  },
  {
    "skill": "Reading",
    "question": "Smartphones eliminate isolation entirely.",
    "passage": "Smartphones have led to a paradox where connectivity breeds profound isolation.",
    "type": "true_false",
    "options": [
      "True",
      "False",
      "Not Given"
    ],
    "correctOption": 1,
    "id": 45
  },
  {
    "skill": "Listening",
    "question": "Listen and type the missing word: The weather is very ________ today.",
    "audioText": "The weather is very beautiful today.",
    "type": "text_input",
    "correctText": [
      "beautiful"
    ],
    "id": 46
  },
  {
    "skill": "Listening",
    "question": "She likes spicy food.",
    "audioText": "I absolutely hate anything with chili in it.",
    "type": "true_false",
    "options": [
      "True",
      "False",
      "Not Given"
    ],
    "correctOption": 1,
    "id": 47
  },
  {
    "skill": "Listening",
    "question": "What does the speaker imply?",
    "audioText": "His media presence was a product of relentless self-promotion.",
    "type": "multiple_choice",
    "options": [
      "Highly respected",
      "True expert",
      "Promotes himself",
      "Avoids media"
    ],
    "correctOption": 2,
    "id": 48
  },
  {
    "skill": "Listening",
    "question": "What does the person want to drink?",
    "audioText": "I would like a cup of coffee, please.",
    "type": "multiple_choice",
    "options": [
      "Tea",
      "Water",
      "Juice",
      "Coffee"
    ],
    "correctOption": 3,
    "id": 49
  },
  {
    "skill": "Listening",
    "question": "How did the audience react?",
    "audioText": "The subtle nuances were entirely lost on the hostile audience.",
    "type": "multiple_choice",
    "options": [
      "Understood perfectly",
      "Missed the nuances",
      "Agreed",
      "Interrupted"
    ],
    "correctOption": 1,
    "id": 50
  },
  {
    "skill": "Listening",
    "question": "Listen and type the missing word: They live in a large ________.",
    "audioText": "They live in a large house.",
    "type": "text_input",
    "correctText": [
      "house"
    ],
    "id": 51
  },
  {
    "skill": "Listening",
    "question": "What is her name?",
    "audioText": "Hello, my name is Anna.",
    "type": "multiple_choice",
    "options": [
      "Sarah",
      "Anna",
      "Emma",
      "Laura"
    ],
    "correctOption": 1,
    "id": 52
  },
  {
    "skill": "Listening",
    "question": "Listen and type the missing word: I have a meeting at ________ o'clock.",
    "audioText": "I have a meeting at three o'clock.",
    "type": "text_input",
    "correctText": [
      "three"
    ],
    "id": 53
  },
  {
    "skill": "Listening",
    "question": "Listen and type the missing word: Don't forget to buy some ________.",
    "audioText": "Don't forget to buy some apples.",
    "type": "text_input",
    "correctText": [
      "apples"
    ],
    "id": 54
  },
  {
    "skill": "Listening",
    "question": "How did the team finish?",
    "audioText": "The team managed to complete it ahead of schedule.",
    "type": "multiple_choice",
    "options": [
      "Worked slowly",
      "Ahead of schedule",
      "Skipped parts",
      "Failed"
    ],
    "correctOption": 1,
    "id": 55
  },
  {
    "skill": "Listening",
    "question": "What color is the car?",
    "audioText": "He drives a bright red car.",
    "type": "multiple_choice",
    "options": [
      "Blue",
      "Red",
      "Green",
      "Black"
    ],
    "correctOption": 1,
    "id": 56
  },
  {
    "skill": "Listening",
    "question": "The speaker is tired.",
    "audioText": "I am feeling extremely exhausted today.",
    "type": "true_false",
    "options": [
      "True",
      "False",
      "Not Given"
    ],
    "correctOption": 0,
    "id": 57
  },
  {
    "skill": "Listening",
    "question": "When are the reports due?",
    "audioText": "Please ensure the reports are submitted by the end of the day.",
    "type": "multiple_choice",
    "options": [
      "Tomorrow",
      "End of the week",
      "End of the day",
      "Next month"
    ],
    "correctOption": 2,
    "id": 58
  },
  {
    "skill": "Listening",
    "question": "Listen and type the missing word: We need to buy more ________.",
    "audioText": "We need to buy more bread.",
    "type": "text_input",
    "correctText": [
      "bread"
    ],
    "id": 59
  },
  {
    "skill": "Listening",
    "question": "Listen and type the missing word: He plays the ________ very well.",
    "audioText": "He plays the piano very well.",
    "type": "text_input",
    "correctText": [
      "piano"
    ],
    "id": 60
  },
  {
    "skill": "Listening",
    "question": "The store is closed.",
    "audioText": "Welcome! We are open 24 hours a day.",
    "type": "true_false",
    "options": [
      "True",
      "False",
      "Not Given"
    ],
    "correctOption": 1,
    "id": 61
  },
  {
    "skill": "Listening",
    "question": "Listen and type the missing word: The dog is ________ loudly.",
    "audioText": "The dog is barking loudly.",
    "type": "text_input",
    "correctText": [
      "barking"
    ],
    "id": 62
  },
  {
    "skill": "Listening",
    "question": "Listen and type the missing word: My favorite color is ________.",
    "audioText": "My favorite color is blue.",
    "type": "text_input",
    "correctText": [
      "blue"
    ],
    "id": 63
  },
  {
    "skill": "Listening",
    "question": "He is a doctor.",
    "audioText": "I have been working as an engineer for ten years.",
    "type": "true_false",
    "options": [
      "True",
      "False",
      "Not Given"
    ],
    "correctOption": 1,
    "id": 64
  },
  {
    "skill": "Listening",
    "question": "Where is the cat?",
    "audioText": "The cat is sleeping on the sofa.",
    "type": "multiple_choice",
    "options": [
      "On the bed",
      "Under the table",
      "On the sofa",
      "Outside"
    ],
    "correctOption": 2,
    "id": 65
  },
  {
    "skill": "Listening",
    "question": "What is the weather like?",
    "audioText": "It is raining heavily outside.",
    "type": "multiple_choice",
    "options": [
      "Sunny",
      "Raining",
      "Snowing",
      "Windy"
    ],
    "correctOption": 1,
    "id": 66
  },
  {
    "skill": "Listening",
    "question": "Listen and type the missing word: She is reading a ________.",
    "audioText": "She is reading a book.",
    "type": "text_input",
    "correctText": [
      "book"
    ],
    "id": 67
  },
  {
    "skill": "Listening",
    "question": "Listen and type the missing word: I want to learn ________.",
    "audioText": "I want to learn English.",
    "type": "text_input",
    "correctText": [
      "english"
    ],
    "id": 68
  },
  {
    "skill": "Listening",
    "question": "The train leaves at 5 PM.",
    "audioText": "The train departs exactly at five o'clock in the evening.",
    "type": "true_false",
    "options": [
      "True",
      "False",
      "Not Given"
    ],
    "correctOption": 0,
    "id": 69
  },
  {
    "skill": "Listening",
    "question": "What is the correct response?",
    "audioText": "Good morning. How are you today?",
    "type": "multiple_choice",
    "options": [
      "I am fine, thank you.",
      "It is a nice day.",
      "Goodbye.",
      "I am going to school."
    ],
    "correctOption": 0,
    "id": 70
  },
  {
    "skill": "Writing",
    "question": "Structure the sentence:",
    "type": "drag_and_drop",
    "draggableItems": [
      "I",
      "love",
      "learning",
      "English"
    ],
    "correctOrder": [
      "I",
      "love",
      "learning",
      "English"
    ],
    "id": 71
  },
  {
    "skill": "Writing",
    "question": "Write the plural form of 'child'.",
    "type": "text_input",
    "correctText": [
      "children"
    ],
    "id": 72
  },
  {
    "skill": "Writing",
    "question": "He is the ____ intelligent student in the class.",
    "type": "text_input",
    "correctText": [
      "most"
    ],
    "id": 73
  },
  {
    "skill": "Writing",
    "question": "Structure the sentence:",
    "type": "drag_and_drop",
    "draggableItems": [
      "I",
      "will",
      "call",
      "you",
      "later"
    ],
    "correctOrder": [
      "I",
      "will",
      "call",
      "you",
      "later"
    ],
    "id": 74
  },
  {
    "skill": "Writing",
    "question": "Structure the sentence:",
    "type": "drag_and_drop",
    "draggableItems": [
      "She",
      "has",
      "already",
      "eaten",
      "breakfast"
    ],
    "correctOrder": [
      "She",
      "has",
      "already",
      "eaten",
      "breakfast"
    ],
    "id": 75
  },
  {
    "skill": "Writing",
    "question": "10-letter word starting with 'i' meaning impossible to prevent.",
    "type": "text_input",
    "correctText": [
      "inevitable"
    ],
    "id": 76
  },
  {
    "skill": "Writing",
    "question": "5-letter synonym for quick starting with r.",
    "type": "text_input",
    "correctText": [
      "rapid"
    ],
    "id": 77
  },
  {
    "skill": "Writing",
    "question": "Structure the sentence:",
    "type": "drag_and_drop",
    "draggableItems": [
      "Do",
      "you",
      "like",
      "drinking",
      "coffee"
    ],
    "correctOrder": [
      "Do",
      "you",
      "like",
      "drinking",
      "coffee"
    ],
    "id": 78
  },
  {
    "skill": "Writing",
    "question": "They are ____ football right now. (missing word)",
    "type": "text_input",
    "correctText": [
      "playing"
    ],
    "id": 79
  },
  {
    "skill": "Writing",
    "question": "Write the past tense of 'to eat'.",
    "type": "text_input",
    "correctText": [
      "ate"
    ],
    "id": 80
  },
  {
    "skill": "Writing",
    "question": "Structure the sentence:",
    "type": "drag_and_drop",
    "draggableItems": [
      "We",
      "should",
      "go",
      "home",
      "now"
    ],
    "correctOrder": [
      "We",
      "should",
      "go",
      "home",
      "now"
    ],
    "id": 81
  },
  {
    "skill": "Writing",
    "question": "Structure the sentence:",
    "type": "drag_and_drop",
    "draggableItems": [
      "The",
      "cat",
      "is",
      "on",
      "the",
      "table"
    ],
    "correctOrder": [
      "The",
      "cat",
      "is",
      "on",
      "the",
      "table"
    ],
    "id": 82
  },
  {
    "skill": "Writing",
    "question": "Structure the sentence:",
    "type": "drag_and_drop",
    "draggableItems": [
      "He",
      "went",
      "to",
      "the",
      "store"
    ],
    "correctOrder": [
      "He",
      "went",
      "to",
      "the",
      "store"
    ],
    "id": 83
  },
  {
    "skill": "Writing",
    "question": "We ____ going to the beach tomorrow.",
    "type": "text_input",
    "correctText": [
      "are"
    ],
    "id": 84
  },
  {
    "skill": "Writing",
    "question": "Write the plural of 'mouse'.",
    "type": "text_input",
    "correctText": [
      "mice"
    ],
    "id": 85
  },
  {
    "skill": "Writing",
    "question": "Neither of the students ____ finished.",
    "type": "text_input",
    "correctText": [
      "has"
    ],
    "id": 86
  },
  {
    "skill": "Writing",
    "question": "Structure the sentence:",
    "type": "drag_and_drop",
    "draggableItems": [
      "They",
      "are",
      "playing",
      "soccer",
      "now"
    ],
    "correctOrder": [
      "They",
      "are",
      "playing",
      "soccer",
      "now"
    ],
    "id": 87
  },
  {
    "skill": "Writing",
    "question": "Structure the sentence:",
    "type": "drag_and_drop",
    "draggableItems": [
      "What",
      "are",
      "you",
      "doing",
      "here"
    ],
    "correctOrder": [
      "What",
      "are",
      "you",
      "doing",
      "here"
    ],
    "id": 88
  },
  {
    "skill": "Writing",
    "question": "By the time we arrived, the movie ____ finished.",
    "type": "text_input",
    "correctText": [
      "had"
    ],
    "id": 89
  },
  {
    "skill": "Writing",
    "question": "Write the past participle of 'go'.",
    "type": "text_input",
    "correctText": [
      "gone"
    ],
    "id": 90
  },
  {
    "skill": "Writing",
    "question": "Structure the sentence:",
    "type": "drag_and_drop",
    "draggableItems": [
      "It",
      "is",
      "raining",
      "very",
      "hard"
    ],
    "correctOrder": [
      "It",
      "is",
      "raining",
      "very",
      "hard"
    ],
    "id": 91
  },
  {
    "skill": "Writing",
    "question": "I look forward to ____ you soon.",
    "type": "text_input",
    "correctText": [
      "seeing"
    ],
    "id": 92
  },
  {
    "skill": "Writing",
    "question": "It is essential that he ____ immediately.",
    "type": "text_input",
    "correctText": [
      "leave"
    ],
    "id": 93
  },
  {
    "skill": "Writing",
    "question": "She ____ a letter to her friend yesterday.",
    "type": "text_input",
    "correctText": [
      "wrote"
    ],
    "id": 94
  },
  {
    "skill": "Writing",
    "question": "I have lived here _____ 2010. (preposition)",
    "type": "text_input",
    "correctText": [
      "since"
    ],
    "id": 95
  }
];
