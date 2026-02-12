/**
 * Utility functions for managing quiz statistics in browser storage
 */

const STATS_KEY = 'quizzie_stats'

/**
 * Get all statistics from localStorage
 * @returns {Object} Statistics object with category data
 */
export function getStatistics() {
  try {
    const stats = localStorage.getItem(STATS_KEY)
    return stats ? JSON.parse(stats) : {}
  } catch (error) {
    console.error('Error reading statistics:', error)
    return {}
  }
}

/**
 * Save statistics to localStorage
 * @param {Object} stats - Statistics object
 */
function saveStatistics(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch (error) {
    console.error('Error saving statistics:', error)
  }
}

/**
 * Record an answer for a category
 * @param {string} category - Category name
 * @param {boolean} isCorrect - Whether the answer was correct
 */
export function recordAnswer(category, isCorrect) {
  const stats = getStatistics()

  if (!stats[category]) {
    stats[category] = {
      correct: 0,
      incorrect: 0
    }
  }

  if (isCorrect) {
    stats[category].correct++
  } else {
    stats[category].incorrect++
  }

  saveStatistics(stats)
}

/**
 * Get top categories by correct answers
 * @param {number} limit - Number of top categories to return
 * @returns {Array} Array of {category, correct, total} objects
 */
export function getTopCorrectCategories(limit = 3) {
  const stats = getStatistics()

  return Object.entries(stats)
    .filter(([category]) => category !== 'Zufälliger Mix') // Exclude random mix
    .map(([category, data]) => ({
      category,
      correct: data.correct,
      total: data.correct + data.incorrect
    }))
    .filter(item => item.total > 0)
    .sort((a, b) => b.correct - a.correct)
    .slice(0, limit)
}

/**
 * Get top categories by incorrect answers
 * @param {number} limit - Number of top categories to return
 * @returns {Array} Array of {category, incorrect, total} objects
 */
export function getTopIncorrectCategories(limit = 3) {
  const stats = getStatistics()

  return Object.entries(stats)
    .filter(([category]) => category !== 'Zufälliger Mix') // Exclude random mix
    .map(([category, data]) => ({
      category,
      incorrect: data.incorrect,
      total: data.correct + data.incorrect
    }))
    .filter(item => item.total > 0)
    .sort((a, b) => b.incorrect - a.incorrect)
    .slice(0, limit)
}

/**
 * Clear all statistics
 */
export function clearStatistics() {
  try {
    localStorage.removeItem(STATS_KEY)
  } catch (error) {
    console.error('Error clearing statistics:', error)
  }
}
