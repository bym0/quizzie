<template>
  <div class="container">
    <div class="quiz-card">
      <StartScreen
        v-if="currentScreen === 'start'"
        :topics="topics"
        :loading="loading"
        @start-quiz="startQuiz"
        @start-random-quiz="startRandomQuiz"
      />

      <QuizScreen
        v-if="currentScreen === 'quiz'"
        :questions="questions"
        :current-index="currentQuestionIndex"
        :topic-name="selectedTopicName"
        :topic-emoji="selectedTopicEmoji"
        @answer-selected="handleAnswerSelected"
        @next-question="nextQuestion"
      />

      <ResultsScreen
        v-if="currentScreen === 'results'"
        :score="score"
        :total="questions.length"
        :topic-name="selectedTopicName"
        @restart="restartQuiz"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import StartScreen from './components/StartScreen.vue'
import QuizScreen from './components/QuizScreen.vue'
import ResultsScreen from './components/ResultsScreen.vue'
import { recordAnswer } from './utils/statistics.js'

const currentScreen = ref('start')
const questions = ref([])
const currentQuestionIndex = ref(0)
const score = ref(0)
const topics = ref([])
const loading = ref(true)
const selectedTopicName = ref('')
const selectedTopicEmoji = ref('')

// Extract emoji from filename (handles flags and compound emojis)
// e.g., "🧪chemistry-1.json" -> "🧪", "🇩🇪deutsches.json" -> "🇩🇪"
function extractEmoji(filename) {
  // Use Intl.Segmenter for proper emoji detection (including flags)
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' })
    const segments = [...segmenter.segment(filename)]
    if (segments.length > 0) {
      const firstSegment = segments[0].segment
      // Check if it's an emoji using a comprehensive regex
      const emojiRegex = /\p{Emoji}/u
      if (emojiRegex.test(firstSegment)) {
        return firstSegment
      }
    }
  } else {
    // Fallback: Match emoji sequences including flags (regional indicators)
    // Flags are 2 regional indicator characters (🇦-🇿)
    const emojiMatch = filename.match(/^(?:[\u{1F1E6}-\u{1F1FF}]{2}|[\p{Emoji}\p{Emoji_Component}\p{Emoji_Modifier}]+)/u)
    if (emojiMatch) {
      return emojiMatch[0]
    }
  }
  return '📚' // Default emoji if none found
}

// Convert filename to display name
// e.g., "🧪chemistry-1.json" -> "Chemistry 1", "🇩🇪deutsches-Allgemeinwissen-1.json" -> "Deutsches Allgemeinwissen 1"
function formatTopicName(filename) {
  // Remove emoji using the same extraction logic
  let nameWithoutEmoji = filename

  // Use Intl.Segmenter for proper emoji detection
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' })
    const segments = [...segmenter.segment(filename)]
    if (segments.length > 0) {
      const firstSegment = segments[0].segment
      const emojiRegex = /\p{Emoji}/u
      if (emojiRegex.test(firstSegment)) {
        nameWithoutEmoji = filename.slice(firstSegment.length)
      }
    }
  } else {
    // Fallback: Remove emoji using regex
    nameWithoutEmoji = filename.replace(/^(?:[\u{1F1E6}-\u{1F1FF}]{2}|[\p{Emoji}\p{Emoji_Component}\p{Emoji_Modifier}]+)/u, '')
  }

  return nameWithoutEmoji
    .replace('.json', '')
    .split('-')
    .map(word => {
      // Capitalize first letter of each word, rest lowercase
      if (word.length === 0) return word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

onMounted(async () => {
  try {
    // Use Vite's glob import to get all question files
    const questionModules = import.meta.glob('/public/questions/*.json')

    const topicList = []
    for (const path in questionModules) {
      // Extract filename from path
      const filename = path.split('/').pop()
      const displayName = formatTopicName(filename)
      const emoji = extractEmoji(filename)

      topicList.push({
        id: filename.replace('.json', ''),
        name: displayName,
        emoji: emoji,
        path: `/questions/${filename}`
      })
    }

    // Sort topics alphabetically
    topics.value = topicList.sort((a, b) => a.name.localeCompare(b.name))
    loading.value = false
  } catch (error) {
    console.error('Error loading topics:', error)
    loading.value = false
  }
})

async function startQuiz(topicPath, topicName, topicEmoji, questionCount) {
  try {
    const response = await fetch(topicPath)
    const loadedQuestions = await response.json()

    if (loadedQuestions.length === 0) {
      alert('No questions available in this topic!')
      return
    }

    // Randomize the questions order
    const shuffledQuestions = shuffleArray(loadedQuestions)

    // Limit to the selected number of questions and add category info
    questions.value = shuffledQuestions.slice(0, questionCount).map(q => ({
      ...q,
      category: topicName
    }))

    selectedTopicName.value = topicName
    selectedTopicEmoji.value = topicEmoji
    currentQuestionIndex.value = 0
    score.value = 0
    currentScreen.value = 'quiz'
  } catch (error) {
    console.error('Error loading questions:', error)
    alert('Failed to load questions for this topic.')
  }
}

async function startRandomQuiz(questionCount, topicsList) {
  try {
    // Fetch questions from all topics
    const allQuestions = []

    for (const topic of topicsList) {
      try {
        const response = await fetch(topic.path)
        const topicQuestions = await response.json()
        // Add category info to each question
        const questionsWithCategory = topicQuestions.map(q => ({
          ...q,
          category: topic.name
        }))
        allQuestions.push(...questionsWithCategory)
      } catch (error) {
        console.error(`Error loading questions from ${topic.name}:`, error)
      }
    }

    if (allQuestions.length === 0) {
      alert('No questions available!')
      return
    }

    // Randomize all questions
    const shuffledQuestions = shuffleArray(allQuestions)

    // Limit to the selected number of questions
    questions.value = shuffledQuestions.slice(0, questionCount)

    selectedTopicName.value = 'Zufälliger Mix'
    selectedTopicEmoji.value = '🎲'
    currentQuestionIndex.value = 0
    score.value = 0
    currentScreen.value = 'quiz'
  } catch (error) {
    console.error('Error loading random questions:', error)
    alert('Failed to load random questions.')
  }
}

function handleAnswerSelected(isCorrect, category) {
  if (isCorrect) {
    score.value++
  }

  // Record the answer in statistics using the actual category
  recordAnswer(category, isCorrect)
}

function nextQuestion() {
  currentQuestionIndex.value++
  if (currentQuestionIndex.value >= questions.value.length) {
    currentScreen.value = 'results'
  }
}

function restartQuiz() {
  currentQuestionIndex.value = 0
  score.value = 0
  selectedTopicName.value = ''
  currentScreen.value = 'start'
}
</script>
