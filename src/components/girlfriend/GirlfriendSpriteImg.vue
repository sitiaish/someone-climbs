<template>
  <div class="sprite-wrap">
    <img
      :src="src"
      :alt="expression"
      class="sprite-img"
      draggable="false"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // impressed | suspicious | naggy | dramatic | confused | judging | upset
  expression: {
    type: String,
    default: 'naggy',
  },
})

// Map expression name → aishah SVG number (1–5).
// Adjust these once you've seen which face is which.
const EXPR_TO_SVG = {
  impressed:  5,
  suspicious: 2,
  naggy:      1,
  dramatic:   4,
  confused:   3,
  judging:    1,
  upset:      2,
}

const src = computed(() => {
  const n = EXPR_TO_SVG[props.expression] ?? 1
  return `/aishah-${n}.svg`
})
</script>

<style scoped>
.sprite-wrap {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
}

.sprite-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  user-select: none;
}
</style>
