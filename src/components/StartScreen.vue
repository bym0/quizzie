<template>
  <div class="screen active">
    <h1>🎯 Quizzie</h1>
    <p class="subtitle">Choose a topic to test your knowledge!</p>

    <div v-if="loading" class="loading">
      <p>Loading topics...</p>
    </div>

    <div v-else-if="topics.length === 0" class="no-topics">
      <p>No topics available. Please add question files to the public/questions folder.</p>
    </div>

    <div v-else>
      <div class="question-count-selector">
        <label for="question-count">Number of questions:</label>
        <select id="question-count" v-model="questionCount" class="question-dropdown">
          <option :value="5">5 questions</option>
          <option :value="10">10 questions</option>
          <option :value="15">15 questions</option>
          <option :value="20">20 questions</option>
          <option :value="25">25 questions</option>
          <option :value="50">50 questions</option>
        </select>
      </div>

      <div class="random-button-container">
        <button @click="selectRandom" class="random-button">
          🎲 Zufällige Fragen
        </button>
      </div>

      <div class="topics-grid">
        <button
          v-for="topic in topics"
          :key="topic.id"
          @click="selectTopic(topic)"
          class="topic-card"
        >
          <span class="topic-icon">{{ topic.emoji }}</span>
          <span class="topic-name">{{ topic.name }}</span>
        </button>
      </div>

      <!-- Statistics Section -->
      <div v-if="hasStatistics" class="statistics-section">
        <h3 class="statistics-title">📊 Your Statistics</h3>

        <div class="statistics-grid">
          <div v-if="topCorrectCategories.length > 0" class="stat-box success">
            <h4>✅ Best Categories</h4>
            <div class="stat-list">
              <div v-for="(item, index) in topCorrectCategories" :key="index" class="stat-item">
                <span class="stat-category">{{ item.category }}</span>
                <span class="stat-value">{{ item.correct }} correct</span>
              </div>
            </div>
          </div>

          <div v-if="topIncorrectCategories.length > 0" class="stat-box warning">
            <h4>❌ Needs Practice</h4>
            <div class="stat-list">
              <div v-for="(item, index) in topIncorrectCategories" :key="index" class="stat-item">
                <span class="stat-category">{{ item.category }}</span>
                <span class="stat-value">{{ item.incorrect }} incorrect</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getTopCorrectCategories, getTopIncorrectCategories } from '../utils/statistics.js'

const props = defineProps({
  topics: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['start-quiz', 'start-random-quiz'])

const questionCount = ref(10)

// Statistics
const topCorrectCategories = computed(() => getTopCorrectCategories(3))
const topIncorrectCategories = computed(() => getTopIncorrectCategories(3))
const hasStatistics = computed(() =>
  topCorrectCategories.value.length > 0 || topIncorrectCategories.value.length > 0
)

function selectTopic(topic) {
  emit('start-quiz', topic.path, topic.name, topic.emoji, questionCount.value)
}

function selectRandom() {
  emit('start-random-quiz', questionCount.value, props.topics)
}
</script>

<style scoped>
.loading,
.no-topics {
  text-align: center;
  padding: 40px;
  color: #666;
}

.question-count-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 25px;
  padding: 15px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 12px;
}

.question-count-selector label {
  font-weight: 600;
  color: #667eea;
  font-size: 0.95rem;
}

.question-dropdown {
  padding: 8px 16px;
  border: 2px solid #667eea;
  border-radius: 8px;
  background: white;
  color: #667eea;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.question-dropdown:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.question-dropdown:focus {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.random-button-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.random-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 15px 30px;
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.random-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6);
}

.random-button:active {
  transform: translateY(-1px);
}

.topics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 15px;
  margin-top: 30px;
}

.topic-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 20px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.topic-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

.topic-card:active {
  transform: translateY(-2px);
}

.topic-icon {
  font-size: 1.8rem;
}

.topic-name {
  text-align: center;
  line-height: 1.3;
}

@media (max-width: 600px) {
  .topics-grid {
    grid-template-columns: 1fr;
  }
}

/* Statistics Section */
.statistics-section {
  margin-top: 50px;
  padding: 25px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 15px;
  border: 2px solid rgba(102, 126, 234, 0.2);
}

.statistics-title {
  text-align: center;
  color: #667eea;
  font-size: 1.3rem;
  margin-bottom: 20px;
  font-weight: 700;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-box {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.stat-box.success {
  border-left: 4px solid #10b981;
}

.stat-box.warning {
  border-left: 4px solid #f59e0b;
}

.stat-box h4 {
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  color: #333;
  font-weight: 700;
}

.stat-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.stat-item:hover {
  transform: translateX(5px);
}

.stat-category {
  font-weight: 600;
  color: #333;
  flex: 1;
}

.stat-value {
  font-weight: 700;
  color: #667eea;
  font-size: 0.9rem;
  white-space: nowrap;
  margin-left: 10px;
}

@media (max-width: 600px) {
  .statistics-grid {
    grid-template-columns: 1fr;
  }

  .statistics-section {
    padding: 20px;
  }
}
</style>
