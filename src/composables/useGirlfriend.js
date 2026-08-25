import { ref, computed } from 'vue'

// Singleton state — shared across all components that call useGirlfriend()
const girlfriendMode = ref(false)

// Sprite expression keys → map to CSS classes on GirlfriendSprite.vue
// Add more expressions as the sprite sheet grows
export const EXPRESSIONS = {
  IMPRESSED:  'impressed',
  SUSPICIOUS: 'suspicious',
  NAGGY:      'naggy',
  DRAMATIC:   'dramatic',
  CONFUSED:   'confused',
  JUDGING:    'judging',
  UPSET:      'upset',
}

// Keyed by question id — matches QUESTIONS array index in QuestionPanel
const REACTIONS = {
  Q1: {
    expression: EXPRESSIONS.IMPRESSED,
    line: "ok fine. 7b is actually hard. don't tell him i said that.",
    subline: "for context that's like... really good. ugh.",
  },
  Q2: {
    expression: EXPRESSIONS.SUSPICIOUS,
    line: "onsights MOST of them?? first try?? i don't believe this.",
    subline: "someone audit this man's tick list.",
  },
  Q3: {
    expression: EXPRESSIONS.NAGGY,
    line: "FIFTEEN bouldering trips. f i f t e e n.",
    subline: "and how many times has he gone grocery shopping? i'll wait.",
  },
  Q4: {
    expression: EXPRESSIONS.DRAMATIC,
    line: "7 countries. SEVEN. and not one of them was with me.",
    subline: "thailand four times though. FOUR.",
  },
  Q5: {
    expression: EXPRESSIONS.CONFUSED,
    line: "what am i looking at. what ARE these wiggly lines.",
    subline: "he calls this a hobby.",
  },
  Q8: {
    expression: EXPRESSIONS.JUDGING,
    line: "septic tank yank. he climbed something called septic tank yank.",
    subline: "and beached whale. who names these.",
  },
}

export function useGirlfriend() {
  function toggle() {
    girlfriendMode.value = !girlfriendMode.value
  }

  function dismiss() {
    girlfriendMode.value = false
  }

  // Given the active question id (e.g. 'Q1'), return her reaction
  function getReaction(questionId) {
    return REACTIONS[questionId] ?? {
      expression: EXPRESSIONS.CONFUSED,
      line: "i have no idea what this means.",
      subline: "but i'm sure it involved being away.",
    }
  }

  const isActive = computed(() => girlfriendMode.value)

  return {
    girlfriendMode,
    isActive,
    toggle,
    dismiss,
    getReaction,
    EXPRESSIONS,
  }
}
