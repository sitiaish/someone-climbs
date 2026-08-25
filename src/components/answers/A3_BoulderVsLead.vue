<template>
  <div class="answer" :class="{ 'gf-theme': girlfriendMode }">
    <div class="answer-frame">
      <template v-if="!girlfriendMode">
        <p class="answer-headline">It's crashpads ftw</p>

        <p class="text-body-2 mb-4">
          They are, statistically, a boulderer who occasionally clips bolts.
        </p>

        <p class="text-body-2 mb-0">
          Person would carry a Cabin-Zero carry-on backpack than comfortably pack a luggage because all their check-in weight allowance goes to the crashpads.
        </p>

        <p class="text-body-2">
           Note the plural. 
        </p>
      </template>

      <template v-else>
        <p class="answer-headline">They are a boulder bro/sis through and through</p>

        <p class="text-body-2 mb-2">
          who'd went for S I X T E E N trips bouldering trips
        </p>

        <p class="text-body-2 ml-4 mb-2">
          (without me) (but it's ok)
        </p>

        <p class="text-body-2 ml-8">
          (is it tho) (yes it's ok)
        </p>
      </template>
    </div>

    <!-- Big split numbers -->
     <div class="flex flex-col gap-4 mb-12">
      <div class="split-display">
        <div
          v-for="item in climbTypeSplit"
          :key="item.type"
          class="split-card"
          :class="item.type === 'Bouldering' ? 'card-boulder' : 'card-lead'"
        >
          <span class="split-number">{{ item.count }}</span>
          <span class="split-label mb-2">{{ item.type === 'Bouldering' ? 'bouldering' : 'lead climbing' }} trips</span>
          <span class="split-pct">{{ item.pct }}%</span>
        </div>
      </div>

      <div class="ratio-block">
        <p class="ratio-text">
          This means that for every <strong class="ratio-big">1</strong> lead climbing trip, there are
          <strong class="ratio-big">{{ ratio }}</strong> bouldering trips.
        </p>
      </div>
    </div>

    <!-- Visual pill bar -->
    <div class="pill-section mb-12">
      <p class="section-label">trip distribution</p>
      <div class="pill-track">
        <div
          v-for="item in climbTypeSplit"
          :key="item.type"
          class="pill-segment"
          :class="item.type === 'Bouldering' ? 'pill-boulder' : 'pill-lead'"
          :style="{ flex: item.count }"
        >
          <span class="pill-inner">
            {{ item.type === 'Bouldering' ? 'boulder' : 'lead' }}
            &nbsp;{{ item.pct }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Trip-by-trip timeline dots grouped by year -->
    <div class="timeline-section mb-12">
      <p class="section-label">trip timeline</p>

      <div class="timeline-years">
        <div v-for="group in climbsByYear" :key="group.year" class="year-row">
          <span class="year-label">{{ group.year }}</span>
          <div class="year-dots">
            <div
              v-for="(trip, i) in group.trips"
              :key="`${group.year}-${i}`"
              class="timeline-dot-wrap"
            >
              <div
                class="timeline-dot"
                :class="trip.type === 'Bouldering' ? 'dot-boulder' : 'dot-lead'"
              />
              <span class="dot-tooltip">
                {{ trip.location }}<br />
                <em>{{ monthLabel(trip.month, trip.year) }}</em>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="dot-legend">
        <span class="dot-legend-item">
          <span class="dot-swatch dot-boulder" /> bouldering
        </span>
        <span class="dot-legend-item">
          <span class="dot-swatch dot-lead" /> sport climbing
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useClimbData } from '@/composables/useClimbData'

defineProps({
  girlfriendMode: { type: Boolean, default: false },
})

const { climbTypeSplit, climbs, formatMonthYear } = useClimbData()

const boulderCount = computed(
  () => climbTypeSplit.value.find(t => t.type === 'Bouldering')?.count ?? 0
)
const leadCount = computed(
  () => climbTypeSplit.value.find(t => t.type === 'Lead')?.count ?? 0
)

const ratio = computed(() => {
  if (!leadCount.value) return '∞'
  return (boulderCount.value / leadCount.value).toFixed(1)
})

const sortedClimbs = computed(() =>
  [...climbs].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    return a.month - b.month
  })
)

// Group sorted trips by year for the labelled timeline
const climbsByYear = computed(() => {
  const map = {}
  sortedClimbs.value.forEach(trip => {
    if (!map[trip.year]) map[trip.year] = []
    map[trip.year].push(trip)
  })
  return Object.keys(map)
    .sort((a, b) => Number(a) - Number(b))
    .map(year => ({ year: Number(year), trips: map[year] }))
})

function monthLabel(month, year) {
  return formatMonthYear(month, year)
}
</script>

<style scoped>
.answer { display: flex; flex-direction: column; }

.answer-headline.gf-headline { color: #e0478a; letter-spacing: 0.15em; }

/* Split display */
.split-display {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.split-card {
  padding: 32px 24px;
  border-radius: 12px;
  border: 1.5px solid transparent;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

@media screen and (max-width: 640px) {
  .split-card {
    padding: 24px 16px;
  }
}

.card-boulder {
  background: #fbe2b9;
  border-color: #ff7876;
}
.card-lead {
  background: #e8f4ff;
  border-color: #0163c6;
}

.split-number {
  font-family: 'Fira Code', monospace;
  font-size: 72px;
  font-weight: 700;
  line-height: 1;
}
.card-boulder .split-number { color: #c94040; }
.card-lead    .split-number { color: #0163c6; }

.split-label {
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.card-boulder .split-label { color: #c94040; }
.card-lead    .split-label { color: #0163c6; }

.split-pct {
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  color: #A9A9A9;
  margin-top: 8px;
}


.ratio-text {
  font-family: 'Fira Code', monospace;
  font-size: 16px;
  color: #3D3830;
  margin: 0;
  line-height: 1.5;
}

.ratio-big {
  font-size: 24px;
  font-weight: 700;
  color: #ff7876;
}

/* Pill bar */
.pill-section { display: flex; flex-direction: column; gap: 10px; }

.section-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #3D3830;
  font-family: 'Fira Code', monospace;
  margin: 0;
}

.pill-track {
  display: flex;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  gap: 3px;
}

.pill-segment {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: flex 0.6s ease;
  min-width: 0;
}
.pill-boulder { background: #ff7876; }
.pill-lead    { background: #0163c6; }

.pill-inner {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  font-weight: 600;
  color: white;
  white-space: nowrap;
  padding: 0 12px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Timeline dots */
.timeline-section { display: flex; flex-direction: column; gap: 12px; }

.timeline-years {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.year-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.year-dots {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.year-label {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #A9A9A9;
  padding: 0 4px;
  white-space: nowrap;
  user-select: none;
}

.timeline-dot-wrap {
  position: relative;
}

.timeline-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: default;
  transition: transform 0.15s;
}
.timeline-dot:hover { transform: scale(1.4); }
.dot-boulder { background: #ff7876; }
.dot-lead    { background: #0163c6; }

.dot-tooltip {
  display: none;
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  background: #222;
  color: white;
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
  line-height: 1.5;
}
.timeline-dot-wrap:hover .dot-tooltip { display: block; }

.dot-legend {
  display: flex;
  gap: 16px;
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  color: #3D3830;
}
.dot-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.dot-swatch {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
</style>
