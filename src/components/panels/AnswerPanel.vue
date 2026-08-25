<template>
  <section class="answer-panel" ref="panelRef">
    <div class="answer-inner">
      <p class="answer-context-label">
        Answering: {{ activeQuestion.shortLabel }}
      </p>

      <!-- Dynamic answer component --> 
      <Transition name="answer-switch" mode="out-in">
        <component
          :is="activeComponent"
          :key="activeQuestion.id"
          :girlfriendMode="girlfriendMode"
        />
      </Transition>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

import A1_HardestGrade  from '@/components/answers/A1_HardestGrade.vue'
import A2_TickTypes     from '@/components/answers/A2_TickTypes.vue'
import A3_BoulderVsLead from '@/components/answers/A3_BoulderVsLead.vue'
import A4_Countries     from '@/components/answers/A4_Countries.vue'
import A5_AllRoutes     from '@/components/answers/A5_AllRoutes.vue'
import A6_CrazyNames    from '@/components/answers/A6_CrazyNames.vue'

// Map question id → component
const ANSWER_MAP = {
  Q1: A1_HardestGrade,
  Q2: A2_TickTypes,
  Q3: A3_BoulderVsLead,
  Q4: A4_Countries,
  Q5: A5_AllRoutes,
  Q6: A6_CrazyNames,
}

// Questions list — must match QuestionPanel order exactly
const QUESTIONS = [
  { id: 'Q1', shortLabel: 'Hardest outdoor lead grade'        },
  { id: 'Q2', shortLabel: 'Onsight, Flash, Send - What are these words even?' },
  { id: 'Q3', shortLabel: 'Bouldering vs lead climbing'      },
  { id: 'Q4', shortLabel: 'Countries where he climbed'    },
  { id: 'Q5', shortLabel: 'All his routes'       },
  { id: 'Q6', shortLabel: 'Creative route and crag names' },
]

const props = defineProps({
  activeIndex:    { type: Number,  default: 0    },
  girlfriendMode: { type: Boolean, default: false },
})

const panelRef = ref(null)

const activeQuestion = computed(() => QUESTIONS[props.activeIndex] ?? QUESTIONS[0])

const activeComponent = computed(() => ANSWER_MAP[activeQuestion.value.id])

// Scroll back to top whenever the question changes
watch(() => props.activeIndex, () => {
  if (panelRef.value) {
    panelRef.value.scrollTo({ top: 0, behavior: 'smooth' })
  }
})
</script>

<style scoped>
.answer-panel {
  height: 100vh;
  overflow-y: auto;
  padding: 48px;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: #fbe2b9 transparent;
}
.answer-panel::-webkit-scrollbar       { width: 4px; }
.answer-panel::-webkit-scrollbar-track { background: transparent; }
.answer-panel::-webkit-scrollbar-thumb { background: #fbe2b9; border-radius: 2px; }

.answer-inner {
  max-width: 85%;
}

@media (min-width: 1600px) {
  .answer-panel {
    padding: 72px;
  }

  .answer-inner {
    max-width: 90%;
  }
}

.answer-context-label {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #3D3830;
}

/* Answer transition — slide up + fade */
.answer-switch-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.answer-switch-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.answer-switch-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.answer-switch-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
