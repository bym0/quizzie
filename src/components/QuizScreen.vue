<template>
  <div class="screen active">
    <div class="quiz-header">
      <p class="topic-badge">{{ topicEmoji }} {{ topicName }}</p>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <p class="question-counter">
        Question {{ currentIndex + 1 }} of {{ questions.length }}
      </p>
    </div>

    <h2 class="question">{{ currentQuestion.question }}</h2>

    <div class="answers">
      <button
        v-for="(answer, index) in currentQuestion.answers"
        :key="index"
        @click="selectAnswer(index)"
        :disabled="answerSelected"
        :class="[
          'answer-btn',
          {
            'correct': answerSelected && index === currentQuestion.correctAnswer,
            'incorrect': answerSelected && index === selectedAnswerIndex && index !== currentQuestion.correctAnswer
          }
        ]"
      >
        {{ answer }}
      </button>
    </div>

    <div v-if="answerSelected" class="explanation">
      <h3>💡 Explanation</h3>
      <p>{{ currentQuestion.explanation }}</p>
      <button @click="handleNext" class="btn btn-primary">Next Question</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  questions: {
    type: Array,
    required: true
  },
  currentIndex: {
    type: Number,
    required: true
  },
  topicName: {
    type: String,
    default: ''
  },
  topicEmoji: {
    type: String,
    default: '📚'
  }
})

const emit = defineEmits(['answer-selected', 'next-question'])

const answerSelected = ref(false)
const selectedAnswerIndex = ref(null)

const currentQuestion = computed(() => props.questions[props.currentIndex])

const progressPercentage = computed(() => {
  return ((props.currentIndex + 1) / props.questions.length) * 100
})

watch(() => props.currentIndex, () => {
  answerSelected.value = false
  selectedAnswerIndex.value = null
})

function selectAnswer(index) {
  if (answerSelected.value) return

  selectedAnswerIndex.value = index
  answerSelected.value = true

  const isCorrect = index === currentQuestion.value.correctAnswer
  emit('answer-selected', isCorrect)
}

function handleNext() {
  emit('next-question')
}
</script>
