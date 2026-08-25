<template>
  <aside class="question-panel" :class="{ 'gf-theme': isActive }">
    <p class="small-label">Investigating The Climb Data</p>

    <div class="question-display">
      <p class="small-label">Question</p>
      <Transition name="fade-slide" mode="out-in">
        <h1 :key="activeQuestion.id" class="question-text">
          {{ activeQuestion.text }}
        </h1>
      </Transition>
    </div>

    <!-- Controls -->
    <div class="controls">

      <!-- Shuffle -->
      <button class="shuffle-btn" @click="shuffle" :disabled="questions.length <= 1">
        <span class="shuffle-icon">↺</span>
        Random question!
      </button>

      <!-- Dropdown — full question list -->
      <div class="dropdown-wrapper pb-8">
        <label class="small-label">or pick one</label>
        <div class="dropdown-container">
          <select
            class="dropdown"
            :value="activeIndex"
            @change="onSelect"
            @focus="dropdownOpen = true"
            @blur="dropdownOpen = false"
          >
            <option
              v-for="(q, i) in questions"
              :key="q.id"
              :value="i"
            >{{ q.shortLabel }}</option>
          </select>
          <span class="dropdown-chevron">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
    </div>

    <!-- Question counter -->
    <!-- <p class="counter">Question {{ activeIndex + 1 }} out of {{ questions.length }}</p> -->
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGirlfriend } from '@/composables/useGirlfriend'

const { isActive } = useGirlfriend()

// ── Questions list ────────────────────────────────────────────────────────
// text      → the big cheeky display question
// shortLabel → compact version for the dropdown
// id        → used by useGirlfriend reactions and AnswerPanel component map


const questions = [
  {
    id: 'Q1',
    text: "So, what's the most difficult rock he has ever climbed?",
    shortLabel: "Hardest outdoor lead grade",
  },
  {
    id: 'Q2',
    text: "Does he finish all his climbs, or does he drop half-way?",
    shortLabel: "Onsight, Flash, Send - What are these words even?",
  },
  {
    id: 'Q3',
    text: "Crashpads or ropes - which does he check-baggage?",
    shortLabel: "Bouldering vs lead climbing",
  },
  {
    id: 'Q3',
    text: "How many countries has he travelled to touch rocks?",
    shortLabel: "Countries where he climbed",
  },
  {
    id: 'Q4',
    text: "Can I see all his routes? Like... all of them?",
    shortLabel: "All his routes",
  },
  {
    id: 'Q5',
    text: "Is it just me, or are climbing route names just... unhinged?",
    shortLabel: "Creative route and crag names",
  }
]

// ── Props & emits ─────────────────────────────────────────────────────────

const emit = defineEmits(['update:activeIndex'])

const props = defineProps({
  activeIndex: {
    type: Number,
    default: 0,
  },
})

// ── Shuffle logic — no repeats until all seen ─────────────────────────────

const dropdownOpen = ref(false)

const seen = ref(new Set([props.activeIndex]))

function shuffle() {
  // Reset seen set if all questions have been shown
  if (seen.value.size >= questions.length) {
    seen.value = new Set([props.activeIndex])
  }

  const unseen = questions
    .map((_, i) => i)
    .filter(i => !seen.value.has(i))

  const pick = unseen[Math.floor(Math.random() * unseen.length)]
  seen.value.add(pick)
  emit('update:activeIndex', pick)
}

function onSelect(e) {
  const idx = Number(e.target.value)
  seen.value.add(idx)
  emit('update:activeIndex', idx)
}

// ── Derived ───────────────────────────────────────────────────────────────

const activeQuestion = computed(() => questions[props.activeIndex])

// Expose questions so AnswerPanel can use the id map without duplicating
defineExpose({ questions })
</script>

<style scoped>
.question-panel {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px;
  gap: 32px;
  overflow: hidden;
}

@media (min-width: 1600px) {
  .question-panel {
    padding: 72px 48px;
  }
}

.small-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #3D3830;
}

.question-display {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: start;
  justify-content: center;
}

.question-text {
  font-size: clamp(28px, 3.5vw, 54px);
  font-weight: 600;
  line-height: 1.15;
  color: #0163c6;
  margin: 0;
}

/* Controls row */
.controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.shuffle-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #ff7876;
  background: transparent;
  border: 1.5px solid #ff7876;
  border-radius: 99px;
  padding: 10px 20px;
  cursor: pointer;
  width: fit-content;
  transition: background 0.15s, color 0.15s;
}

.shuffle-btn:hover:not(:disabled) {
  background: #ff7876;
  color: white;
}

.shuffle-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.shuffle-icon {
  font-size: 18px;
  line-height: 1;
}

.dropdown-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dropdown-container {
  position: relative;
  display: flex;
  align-items: center;
}

.dropdown-chevron {
  position: absolute;
  right: 16px;
  pointer-events: none;
  color: #ff7876;
  display: flex;
  align-items: center;
}

.dropdown {
  width: 100%;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  color: #ff7876;
  font-weight: 500;
  background: transparent;
  border: 1.5px solid #ff7876;
  border-radius: 99px;
  padding: 10px 20px;
  cursor: pointer;
  appearance: none;
  padding-right: 36px;
}


.dropdown:hover:not(:disabled) {
  color: white;
  background-color: #ff7876;
}


.dropdown:focus {
  outline: none;
  border-color: #ff7876;
}

.counter {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  color: #3D3830;
}

/* ── Girlfriend theme overrides ────────────────────────────── */
.gf-theme .question-text {
  color: white;
  font-family: 'Gloria Hallelujah', cursive;
  font-size: clamp(24px, 3vw, 54px);
  line-height: 1.4;
}

.gf-theme .counter {
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Gloria Hallelujah', cursive;
  font-size: 11px;
}

.gf-theme .dropdown-label {
  color: rgba(255, 255, 255, 0.6);
}

.gf-theme .shuffle-btn {
  color: white;
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.4);
}

.gf-theme .shuffle-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.gf-theme .dropdown:hover {
  background: rgba(255, 255, 255, 0.3);
}

.gf-theme .dropdown {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.4);
  color: white;
}

.gf-theme .dropdown:focus {
  border-color: white;
}

.gf-theme .dropdown-chevron {
  color: white;
}

.gf-theme .dropdown option {
  background: #e8388a;
  color: white;
}

.question-panel.gf-theme .small-label {
  color: white;
}

/* Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
