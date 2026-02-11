<template>
  <div class="screen active">
    <h1>🎉 Quiz Complete!</h1>
    <p v-if="topicName" class="topic-label">{{ topicName }}</p>
    <div class="results-container">
      <div class="score-circle">
        <span>{{ percentage }}%</span>
      </div>
      <p class="score-text">You scored {{ score }} out of {{ total }}</p>
      <p class="result-message">{{ message }}</p>
    </div>
    <button @click="$emit('restart')" class="btn btn-primary">Try Again</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  topicName: {
    type: String,
    default: ''
  }
})

defineEmits(['restart'])

const percentage = computed(() => {
  return Math.round((props.score / props.total) * 100)
})

const message = computed(() => {
  const p = percentage.value
  if (p === 100) {
    return "Perfect score! You're a genius! 🌟"
  } else if (p >= 80) {
    return "Excellent work! You really know your stuff! 🎓"
  } else if (p >= 60) {
    return "Good job! Keep learning and improving! 📚"
  } else if (p >= 40) {
    return "Not bad! There's room for improvement! 💪"
  } else {
    return "Keep practicing! You'll do better next time! 🚀"
  }
})
</script>
