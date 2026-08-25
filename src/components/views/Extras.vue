<template>
  <main class="extras-root">
    <div class="extras-inner">

      <a href="#/" class="back-link">← back to homepage</a>

      <header class="extras-header">
        <p class="eyebrow">bonus content</p>
        <h1 class="extras-headline">didn't make it to the cut</h1>
        <p class="extras-sub">
          These are all the route cards I built before I figured out what the project actually was.
          Too good to delete. Not quite right for the main flow. Here they live.
        </p>
      </header>

      <!-- Filter bar -->
      <div class="filter-bar">
        <p class="filter-heading">filter by</p>

        <div class="filter-group">
          <span class="filter-label">grade</span>
          <div class="filter-pills">
            <label
              v-for="g in uniqueGrades"
              :key="g"
              class="pill"
              :class="{ active: selectedGrades.has(g) }"
            >
              <input type="checkbox" :value="g" :checked="selectedGrades.has(g)" @change="toggleGrade(g)" />
              {{ g }}
            </label>
          </div>
        </div>

        <div class="filter-group">
          <span class="filter-label">tick type</span>
          <div class="filter-pills">
            <label
              v-for="t in uniqueTickTypes"
              :key="t"
              class="pill"
              :class="{ active: selectedTickTypes.has(t) }"
            >
              <input type="checkbox" :value="t" :checked="selectedTickTypes.has(t)" @change="toggleTick(t)" />
              {{ t === 'Red point' ? 'Redpoint' : t }}
            </label>
          </div>
        </div>

        <div class="filter-group">
          <span class="filter-label">country</span>
          <div class="filter-pills">
            <label
              v-for="c in uniqueCountries"
              :key="c"
              class="pill"
              :class="{ active: selectedCountries.has(c) }"
            >
              <input type="checkbox" :value="c" :checked="selectedCountries.has(c)" @change="toggleCountry(c)" />
              {{ c }}
            </label>
          </div>
        </div>

        <div class="filter-meta">
          <span class="filter-count">
            showing <strong>{{ filteredRoutes.length }}</strong> of {{ routes.length }} routes
          </span>
          <button v-if="hasActiveFilters" class="clear-btn" @click="clearAll">clear all</button>
        </div>
      </div>
    </div>

    <ClimbCards :items="filteredRoutes" />
  </main>
</template>

<script setup>
defineOptions({ name: 'ExtrasPage' })

import { ref, computed } from 'vue'
import ClimbCards from '@/components/views/ClimbCards.vue'
import { useClimbData } from '@/composables/useClimbData'

const { routes, normaliseGrade, GRADE_ORDER } = useClimbData()

// ── Filter state ─────────────────────────────────────────────────────────────
const selectedGrades    = ref(new Set())
const selectedTickTypes = ref(new Set())
const selectedCountries = ref(new Set())

// ── Available options (derived from actual data) ──────────────────────────────
const uniqueGrades = computed(() => {
  const inData = new Set(routes.map(r => normaliseGrade(r.Grade)).filter(Boolean))
  return GRADE_ORDER.filter(g => inData.has(g))
})

const uniqueTickTypes = computed(() => {
  return [...new Set(routes.map(r => r.Finish).filter(Boolean))]
})

const uniqueCountries = computed(() => {
  return [...new Set(routes.map(r => r.Country).filter(Boolean))].sort()
})

// ── Toggle helpers ────────────────────────────────────────────────────────────
function toggleGrade(g) {
  const next = new Set(selectedGrades.value)
  next.has(g) ? next.delete(g) : next.add(g)
  selectedGrades.value = next
}

function toggleTick(t) {
  const next = new Set(selectedTickTypes.value)
  next.has(t) ? next.delete(t) : next.add(t)
  selectedTickTypes.value = next
}

function toggleCountry(c) {
  const next = new Set(selectedCountries.value)
  next.has(c) ? next.delete(c) : next.add(c)
  selectedCountries.value = next
}

function clearAll() {
  selectedGrades.value    = new Set()
  selectedTickTypes.value = new Set()
  selectedCountries.value = new Set()
}

// ── Filtered results (AND across groups, OR within group) ─────────────────────
const filteredRoutes = computed(() => {
  return routes.filter(r => {
    const gradeOk   = selectedGrades.value.size === 0    || selectedGrades.value.has(normaliseGrade(r.Grade))
    const tickOk    = selectedTickTypes.value.size === 0 || selectedTickTypes.value.has(r.Finish)
    const countryOk = selectedCountries.value.size === 0 || selectedCountries.value.has(r.Country)
    return gradeOk && tickOk && countryOk
  })
})

const hasActiveFilters = computed(() =>
  selectedGrades.value.size > 0 || selectedTickTypes.value.size > 0 || selectedCountries.value.size > 0
)
</script>

<style scoped>
.extras-root {
  min-height: 100vh;
  background: #fffdf8;
  padding: 48px 24px 96px;
  font-family: 'Fira Code', monospace;
  margin: 0 auto;
}

.extras-inner {
  max-width: 960px;
  margin: 0 auto;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.back-link {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  color: #ff7876;
  text-decoration: none;
  align-self: flex-start;
  opacity: 0.7;
  transition: opacity 0.15s;
}
.back-link:hover { opacity: 1; }

.extras-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 640px;
}

.eyebrow {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #ff7876;
  margin: 0;
  opacity: 0.7;
}

.extras-headline {
  font-family: 'Gloria Hallelujah', cursive;
  font-size: clamp(22px, 4vw, 32px);
  font-weight: 700;
  color: #1C1917;
  line-height: 1.4;
  margin: 0;
}

.extras-sub {
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  color: #888;
  line-height: 1.7;
  margin: 0;
}

/* ── Filter bar ────────────────────────────────────────────────────────────── */
.filter-bar {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 24px 18px;
  border: 1.5px solid #f0d9b0;
  background: #fef7ec;
}

.filter-heading {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #bbb;
  margin: 0 0 2px;
}

.filter-group {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.filter-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #999;
  padding-top: 7px;
  min-width: 68px;
  flex-shrink: 0;
}

.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill {
  display: inline-flex;
  align-items: center;
  padding: 5px 14px;
  border: 1.5px solid #ff7876;
  background: transparent;
  color: #ff7876;
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  user-select: none;
}

.pill input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.pill:hover {
  background: #fff0ef;
}

.pill.active {
  background: #ff7876;
  color: #fff;
}

.filter-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 4px;
  border-top: 1px dashed #f0d9b0;
  margin-top: 2px;
}

.filter-count {
  font-size: 12px;
  color: #aaa;
}

.filter-count strong {
  color: #1C1917;
}

.clear-btn {
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  color: #ff7876;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  opacity: 0.8;
  transition: opacity 0.12s;
}
.clear-btn:hover { opacity: 1; }
</style>
