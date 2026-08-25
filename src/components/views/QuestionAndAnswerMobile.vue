<template>
  <div ref="rootRef" class="mqa-root" :class="{ 'gf-mode': isActive }">

    <!-- Sticky top bar -->
    <div class="sticky-bar" :class="{ 'gf-bar': isActive }">
      <p class="bar">investigating his climb data</p>

      <Transition name="q-fade" mode="out-in">
        <h2 :key="activeQuestion.id" class="bar-question">{{ activeQuestion.text }}</h2>
      </Transition>

      <div class="bar-controls">
        <!-- GF mode toggle switch -->
        <label class="gf-switch">
          <input type="checkbox" class="gf-input" :checked="isActive" @change="toggle" />
          <span class="gf-track"><span class="gf-thumb" /></span>
          <span class="gf-label">her mode</span>
        </label>

        <!-- Shuffle -->
        <button class="shuffle-btn" :class="{ 'gf-shuffle': isActive }" @click="shuffle">
          <span>↺</span> random
        </button>
      </div>
    </div>

    <!-- GF portrait + speech bubble — shown below sticky bar when her mode is on -->
    <Transition name="gf-reveal">
      <div v-if="isActive" class="gf-row">
        <img :src="`${baseUrl}aishah-${spriteNum}.svg`" alt="Aishah" class="gf-portrait" />
        <div class="gf-bubble">
          <p class="gf-bubble-line">{{ reaction.line }}</p>
          <p class="gf-bubble-subline">{{ reaction.subline }}</p>
        </div>
      </div>
    </Transition>

    <!-- Answer area — scrolls with the page -->
    <div class="answer-area">
      <AnswerPanel :activeIndex="activeIndex" :girlfriendMode="isActive" />
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import AnswerPanel from '@/components/panels/AnswerPanel.vue'
import { useGirlfriend } from '@/composables/useGirlfriend'

const { isActive, toggle, getReaction } = useGirlfriend()

const QUESTION_IDS = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q8']

const questions = [
  { id: 'Q1', text: "So, what's the most difficult rock he has ever climbed?",  shortLabel: 'Hardest outdoor lead grade' },
  { id: 'Q2', text: "Does he finish all his climbs, or does he drop half-way?",     shortLabel: 'Onsight, Flash, Send — what are these?' },
  { id: 'Q3', text: "Crashpads or ropes — which does he check-baggage?",            shortLabel: 'Bouldering vs lead climbing' },
  { id: 'Q3', text: "How many countries has he travelled to touch rocks?",           shortLabel: 'Countries where he climbed' },
  { id: 'Q4', text: "Can I see all his routes? Like... all of them?",               shortLabel: 'All his routes' },
  { id: 'Q5', text: "Are climbing route names just unhinged, or is it just him?",   shortLabel: 'Creative route and crag names' },
]

const rootRef = ref(null)
const activeIndex = ref(0)
const activeQuestion = computed(() => questions[activeIndex.value] ?? questions[0])
const activeQuestionId = computed(() => QUESTION_IDS[activeIndex.value] ?? 'Q1')
const reaction = computed(() => getReaction(activeQuestionId.value))

const EXPR_TO_SVG = { impressed: 5, suspicious: 2, naggy: 1, dramatic: 4, confused: 3, judging: 1, upset: 2 }
const spriteNum = computed(() => EXPR_TO_SVG[reaction.value?.expression] ?? 1)
const baseUrl = import.meta.env.BASE_URL

// Scroll to top of this component (not window top) when question changes
watch(activeIndex, () => rootRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))

// Shuffle — no repeats until all seen
const seen = ref(new Set([0]))
function shuffle() {
  if (seen.value.size >= questions.length) seen.value = new Set([activeIndex.value])
  const unseen = questions.map((_, i) => i).filter(i => !seen.value.has(i))
  const pick = unseen[Math.floor(Math.random() * unseen.length)]
  seen.value.add(pick)
  activeIndex.value = pick
}

</script>

<style scoped>
.mqa-root {
  min-height: 100vh;
  background: #fffdf8;
  font-family: 'Fira Code', monospace;
  overflow-x: clip; /* clip not hidden — hidden breaks position:sticky */
}

/* ── Sticky bar ──────────────────────────────────────────────── */

.sticky-bar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #F5F0E8;
  padding: 20px 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-bottom: 1px solid #e8e0d4;
  transition: background 0.3s ease;
}

.sticky-bar.gf-bar {
  background: #FF4FA3;
  border-bottom-color: #e0287a;
}

.bar {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #3D3830;
  margin: 0;
  opacity: 0.6;
}
.gf-bar .bar { color: rgba(255,255,255,0.7); }

.bar-question {
  font-size: clamp(18px, 4.5vw, 26px);
  font-weight: 600;
  color: #0163c6;
  line-height: 1.25;
  margin: 0;
}
.gf-bar .bar-question {
  color: white;
  font-family: 'Gloria Hallelujah', cursive;
  font-size: clamp(15px, 3.5vw, 22px);
  line-height: 1.4;
}

/* Controls row: gf switch + shuffle */
.bar-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ── GF toggle switch ──────────────────────────────────────── */

.gf-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.gf-input { display: none; }

.gf-track {
  position: relative;
  width: 40px;
  height: 22px;
  background: #d0c8be;
  border-radius: 99px;
  flex-shrink: 0;
  transition: background 0.2s;
}

.gf-input:checked + .gf-track { background: white; }

.gf-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s, background 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.gf-input:checked + .gf-track .gf-thumb {
  transform: translateX(18px);
  background: #e8388a;
}

.gf-label {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  font-weight: 600;
  color: #3D3830;
  white-space: nowrap;
}
.gf-bar .gf-label { color: white; }

/* ── Shuffle button ────────────────────────────────────────── */

.shuffle-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  font-weight: 500;
  color: #ff7876;
  background: transparent;
  border: 1.5px solid #ff7876;
  border-radius: 99px;
  padding: 7px 14px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}
.shuffle-btn:hover { background: #ff7876; color: white; }

.shuffle-btn.gf-shuffle {
  color: white;
  border-color: rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.15);
}
.shuffle-btn.gf-shuffle:hover {
  background: rgba(255,255,255,0.3);
}

/* ── Dropdown ──────────────────────────────────────────────── */

.q-select-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.q-select {
  width: 100%;
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  color: #ff7876;
  font-weight: 500;
  background: transparent;
  border: 1.5px solid #ff7876;
  border-radius: 99px;
  padding: 7px 36px 7px 16px;
  cursor: pointer;
  appearance: none;
  transition: background 0.15s, color 0.15s;
}
.q-select:hover,
.q-select:focus { background: #ff7876; color: white; outline: none; }

.q-select.gf-select {
  color: white;
  border-color: rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.15);
}
.q-select.gf-select option { background: #e8388a; color: white; }

.select-chevron {
  position: absolute;
  right: 14px;
  pointer-events: none;
  color: #ff7876;
  display: flex;
  align-items: center;
}
.gf-bar .select-chevron { color: white; }

/* ── GF portrait + bubble row ──────────────────────────────── */

.gf-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 24px;
  background: #fff0f6;
  border-bottom: 1px solid #ffb3d1;
}

.gf-portrait {
  width: 72px;
  height: 72px;
  object-fit: contain;
  flex-shrink: 0;
}

.gf-bubble {
  background: white;
  border: 1.5px solid #e8388a;
  border-radius: 12px;
  padding: 12px 14px;
  position: relative;
  flex: 1;
}

.gf-bubble::before {
  content: '';
  position: absolute;
  left: -9px;
  top: 18px;
  width: 0;
  height: 0;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-right: 9px solid #e8388a;
}
.gf-bubble::after {
  content: '';
  position: absolute;
  left: -7px;
  top: 19px;
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 8px solid white;
}

.gf-bubble-line {
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  font-weight: 600;
  color: #e8388a;
  margin: 0 0 4px;
  line-height: 1.4;
}

.gf-bubble-subline {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  color: #aaa;
  margin: 0;
  font-style: italic;
  line-height: 1.4;
}

/* ── Answer area ───────────────────────────────────────────── */

:deep(.answer-panel) {
  height: auto;
  min-height: unset;
  overflow-y: visible;
  overflow-x: hidden;
  padding: 32px 24px 80px;
}

:deep(.answer-inner) {
  max-width: 100%;
  overflow-x: hidden;
}

/* ── Transitions ───────────────────────────────────────────── */

.q-fade-enter-active,
.q-fade-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.q-fade-enter-from   { opacity: 0; transform: translateY(8px); }
.q-fade-leave-to     { opacity: 0; transform: translateY(-6px); }

.gf-reveal-enter-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.gf-reveal-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.gf-reveal-enter-from   { opacity: 0; transform: translateY(-8px); }
.gf-reveal-leave-to     { opacity: 0; transform: translateY(-4px); }
</style>
