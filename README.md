# 🎯 Quizzie - Vue 3 Quiz Application

A beautiful, interactive quiz application built with Vue 3, Vite, and modern JavaScript.

## ✨ Features

- 📚 Multiple quiz topics with automatic detection
- 🎲 Questions randomized every time you take a quiz
- 🎨 Clean, modern UI with gradient purple theme
- 📊 Real-time progress tracking
- 🎯 Instant feedback on answers
- 💡 Educational explanations for each question
- 📱 Fully responsive design
- 🚀 Lightning-fast with Vite
- ⚡️ Vue 3 Composition API

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📝 Adding Quiz Topics

The app automatically detects and creates topics based on JSON files in the `public/questions/` folder.

### Creating a New Topic

1. Create a new JSON file in `public/questions/` folder
2. Name it using the format: `topic-name.json` (e.g., `geography-1.json`, `chemistry-1.json`)
3. The filename will be converted to a display name automatically:
   - `geography-1.json` → "Geography 1"
   - `chemistry-1.json` → "Chemistry 1"
   - `world-history.json` → "World History"

### Question Format

Each JSON file should contain an array of questions with this structure:

```json
[
  {
    "question": "Your question here?",
    "answers": [
      "Answer 1",
      "Answer 2",
      "Answer 3",
      "Answer 4"
    ],
    "correctAnswer": 0,
    "explanation": "Explanation of the correct answer."
  }
]
```

**Fields:**
- `question`: The question text
- `answers`: Array of 4 possible answers
- `correctAnswer`: Index of the correct answer (0-3)
- `explanation`: Educational explanation shown after answering

### Example Topics Included

- **General** - Mixed general knowledge questions
- **Geography 1** - World geography questions
- **Chemistry 1** - Basic chemistry questions

Simply add more JSON files to create new topics!

## 🏗️ Project Structure

```
quizzie/
├── public/
│   └── questions/          # Quiz topics folder
│       ├── general.json        # General knowledge questions
│       ├── geography-1.json    # Geography questions
│       └── chemistry-1.json    # Chemistry questions
├── src/
│   ├── components/
│   │   ├── StartScreen.vue    # Topic selection screen
│   │   ├── QuizScreen.vue     # Quiz question component
│   │   └── ResultsScreen.vue  # Results screen component
│   ├── App.vue             # Main app component
│   ├── main.js             # App entry point
│   └── style.css           # Global styles
├── index.html              # HTML entry point
├── package.json            # Project dependencies
└── vite.config.js          # Vite configuration
```

## 🛠️ Technologies Used

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **JavaScript (ES6+)** - Modern JavaScript features

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes!
