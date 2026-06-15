# Highway Academy - Language Test System Documentation

This document explains the internal mechanisms, grading algorithms, and architectural components of the **Interactive English Placement Test** (`EnglishTest.tsx`).

## 1. System Architecture overview
The testing application is a unified, stateful React component. It doesn't rely on multiple pages; instead, it utilizes local state Arrays (`answers`) and an incremental index (`currentQuestion`) to iterate through a predefined `questions` bank.

The test is fully interactive and incorporates four distinct question archetypes natively without external heavy libraries:
* **`multiple_choice`**: Classic Select-One input.
* **`text_input`**: Open-ended typing input with external Dictionary API validation.
* **`drag_and_drop`**: Complex structural sorting using physical Framer Motion interfaces.
* **`matching`**: Direct item-to-definition mapping using live React SVG node coordinate calculation.

---

## 2. Validation & Security Mechanisms
To ensure that the test produces legitimate metrics, a few validation fences exist:

1. **Anti-Skip Protection**: Users cannot hit "Next" unless `isAnswerValid` returns True. 
   - Drag & Drop questions require all slots to be filled.
   - Matching requires every left-side item to form a completed pair.
2. **Text Input Dictionary Validation (`validateTextWithApi`)**: 
   When a user types an answer into a text box, the system executes frontend fast checks (to strip numeric characters and filter out vowel-lacking keyboard smashes). If those pass, the word is sent asynchronously to `dictionaryapi.dev`. If at least 60% of the parsed words are authenticated real English words, the submission goes through. This prevents students from arbitrarily mashing keys to brute-force the test.

---

## 3. The Grading System (The "Exact" Check)

When the user finishes the 30th question, the system invokes `calculateResult()`, which executes a surgical evaluation of the `answers[]` state against the source of truth `questions[]` array.

How it assigns points:
* **Multiple Choice**: Direct numeric index comparison: `ans === q.correctOption`.
* **Text Input**: The input is heavily stripped of whitespace and forced into lowercase. It is then compared against a dynamic array of valid synonyms (`q.correctText`), allowing flexible correct answers (e.g., both "going" and "are going" could be flagged as valid).
* **Drag and Drop**: Reordered arrays are compared for absolute sequence parity using `JSON.stringify(userArray) === JSON.stringify(correctOrderArray)`.
* **Matching**: The user generates an object mapping `{ leftId : rightId }`. The grading loop iterates through every key in the standard `q.correctMatches` object map, failing the entire question if even a single pair differs.

**Result Calculation:**
The test assigns a 100% total scale safely dynamically calculated by:
`Math.round((correctCount / questions.length) * 100)`

With 30 questions, each is precisely worth **3.333%**. 

### CEFR Bracket Calculation
The system translates this final percentage into the official Common European Framework of Reference for Languages (CEFR) categories:
* `0% - 30%` -> **A1 (Beginner)** 
* `31% - 50%` -> **A2 (Elementary)**
* `51% - 70%` -> **B1 (Intermediate)**
* `71% - 85%` -> **B2 (Upper Intermediate)**
* `86% - 100%` -> **C1 (Advanced)**

Once evaluated, the parameters are wrapped and passed through the React Router to naturally redirect the student to the "Programs" page where `testLevel` dynamically pre-populates their application form.
