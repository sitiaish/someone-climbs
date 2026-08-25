<template>
  <!-- Mobile / iPad: single-column sticky layout -->
  <QuestionAndAnswerMobile v-if="isMobile" />

  <!-- Desktop: two-panel layout -->
  <div v-else class="story-root">
    <div class="story-layout">

      <!-- LEFT — question panel -->
      <div class="panel-left" :class="{ 'gf-tint': girlfriendMode }">
        <QuestionPanel
          :activeIndex="activeIndex"
          @update:activeIndex="selectQuestion"
        />
      </div>

      <!-- Divider -->
      <div class="panel-divider" />

      <!-- RIGHT — answer panel -->
      <div class="panel-right">
        <AnswerPanel
          :activeIndex="activeIndex"
          :girlfriendMode="girlfriendMode"
        />

        <GirlfriendToggle :activeQuestionId="activeQuestionId" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

import QuestionPanel           from '@/components/panels/QuestionPanel.vue'
import AnswerPanel             from '@/components/panels/AnswerPanel.vue'
import GirlfriendToggle        from '@/components/girlfriend/GirlfriendToggle.vue'
import QuestionAndAnswerMobile from '@/components/views/QuestionAndAnswerMobile.vue'
import { useGirlfriend } from '@/composables/useGirlfriend'

// ── Questions list (id only — labels live in QuestionPanel) ──────────────
const QUESTION_IDS = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q8', 'Q9']

// ── Mobile detection (mobile + iPad ≤ 1100px) ───────────────────────────
const isMobile = ref(window.innerWidth <= 1100)

function onResize() { isMobile.value = window.innerWidth <= 1100 }
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))

// ── Active question state ────────────────────────────────────────────────
const activeIndex = ref(0)

function selectQuestion(index) {
  activeIndex.value = index
}

const activeQuestionId = computed(() => QUESTION_IDS[activeIndex.value] ?? 'Q1')

// ── Girlfriend mode ──────────────────────────────────────────────────────
const { isActive: girlfriendMode } = useGirlfriend()
</script>

<style scoped>
.story-root {
  width: 100%;
  height: 100vh;
  overflow: hidden;     /* panels manage their own scroll */
  background: #fffdf8;
  font-family: 'Fira Code', monospace;
}

.story-layout {
  display: grid;
  grid-template-columns: 520px 2px 1fr;
  height: 100vh;
}

/* Widescreen */
@media (min-width: 1600px) {
  .story-layout {
    grid-template-columns: 640px 2px 1fr;
  }
}


/* Left panel */
.panel-left {
  background: #F5F0E8;
  border-right: none;
  transition: background 0.4s ease;
  min-height: 0;
}

/* Girlfriend mode tints the left panel pink */
.panel-left.gf-tint {
  background: #FF4FA3;
}

/* Divider line */
.panel-divider {
  background: #fbe2b9;
  width: 1px;
  height: 100vh;
}

/* Right panel */
.panel-right {
  background: white;
  position: relative;
  min-height: 0;
  overflow: hidden;     /* AnswerPanel handles overflow-y internally */
}

</style>
