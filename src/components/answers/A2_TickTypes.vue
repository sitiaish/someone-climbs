<template>
  <div class="answer" :class="{ 'gf-theme': girlfriendMode }">

    <div class="answer-frame">
      <template v-if="!girlfriendMode">
        <p class="answer-headline">He finishes most things that he'd touched.</p>

        <p class="text-body-2">
          Turns out, he onsights the majority of his routes. <br>But what does onsight mean?
        </p>
      </template>

      <template v-else>
        <p class="answer-headline gf-headline">Onsights most of them?</p>
        <p class="answer-headline gf-headline">and on the first try?</p>
        <p class="text-body-2">
          Someone check this man's stats. I'm serious!
        </p>
      </template>


      <div class="bar-section mt-8 mb-6">
        <p class="section-label">out of {{ totalRoutes }} total routes</p>
        <div class="stacked-bar">
          <div
            v-for="tick in tickCounts"
            :key="tick.type"
            class="stacked-segment"
            :class="`segment-${tick.type.toLowerCase().replace(' ', '')}`"
            :style="{ width: tick.pct + '%' }"
          >
            <span v-if="tick.pct > 10" class="segment-label">{{ tick.label }} {{ tick.pct }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-12">
      <p class="text-body-2 mb-2">
        In the sport climbing lingo, the words <i>onsight</i>, <i>redpoint</i>, and <i>flash</i> all refer to a successful lead climbing attempt, but they are differentiated by the factors like:
      </p>

      <table class="climbing-table">
        <thead>
          <tr>
            <th>Term</th>
            <th>First Try?</th>
            <th>Prior Beta?</th>
            <th>Prior practice?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Onsight</td>
            <td>✅</td>
            <td>❌</td>
            <td>❌</td>
          </tr>
          <tr>
            <td>Flash</td>
            <td>✅</td>
            <td>✅</td>
            <td>❌</td>
          </tr>
          <tr>
            <td>Redpoint</td>
            <td>❌</td>
            <td>✅ / ❌</td>
            <td>✅</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Per-route list grouped by tick type -->
    <div class="route-breakdown">
      <p class="section-label">by route</p>
      <div class="tick-groups">
        <div v-for="tick in tickCounts" :key="tick.type" class="tick-group">
          <div class="tick-group-header" :class="`header-${tick.type.toLowerCase().replace(' ', '')}`">
            {{ tick.label }} ({{ tick.count }})
          </div>
          <ul class="route-list">
            <li
              v-for="route in routesByTick[tick.type]"
              :key="route.Route"
              class="route-item"
            >
              <span class="route-name">{{ route.Route }}</span>
              <span class="route-grade">{{ route.Grade }}</span>
            </li>
          </ul>
        </div>
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

const { tickCounts, routes, gradeRank } = useClimbData()

const totalRoutes = computed(() => routes.length)

const routesByTick = computed(() => {
  const groups = { Onsight: [], Flash: [], 'Red point': [] }
  routes.forEach(r => {
    if (groups[r.Finish]) groups[r.Finish].push(r)
  })
  // Sort each group hardest → easiest
  Object.keys(groups).forEach(tick => {
    groups[tick].sort((a, b) => gradeRank(b.Grade) - gradeRank(a.Grade))
  })
  return groups
})
</script>

<style scoped>
.answer { display: flex; flex-direction: column; }

.answer-headline {
  font-family: 'Fira Code', monospace;
  /* font-size: clamp(36px, 5vw, 64px); */
  /* font-weight: 700; */
  color: #0163c6;
  line-height: 1.1;
  margin: 0;
}
.answer-headline.gf-headline { color: #e0478a; }

/* Stacked bar */
.bar-section { display: flex; flex-direction: column; }

.section-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #1C1917;
  font-family: 'Fira Code', monospace;
  margin-bottom: 8px;
}

.stacked-bar {
  display: flex;
  height: 32px;
  border-radius: 8px;
  overflow: hidden;
  gap: 2px;
}

.stacked-segment {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.6s ease;
  border-radius: 2px;
}
.segment-onsight  { background: #0163c6; }
.segment-flash    { background: #f0a500; }
.segment-redpoint { background: #ff7876; }

.segment-label {
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  font-weight: 600;
  color: white;
  white-space: nowrap;
  padding: 0 8px;
}

/* Route breakdown */
.route-breakdown { display: flex; flex-direction: column; }

.tick-groups {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  align-items: start;
}

.tick-group-header {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 6px 0;
  margin-bottom: 8px;
  border-bottom: 1.5px solid currentColor;
}
.header-onsight  { color: #0163c6; }
.header-flash    { color: #c07800; }
.header-redpoint { color: #c94040; }

.route-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.route-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.route-name {
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  color: #333;
}

.route-grade {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  color: #aaa;
  white-space: nowrap;
}


.climbing-table {
  width: 100%;
  border-collapse: collapse;
  background: #F5F0E8;
  color: #1F1F1F;
  border: 1px solid #d8d2c8;
}

.climbing-table th,
.climbing-table td {
  padding: 12px 16px;
  border: 1px solid #d8d2c8;
  text-align: left;
}

.climbing-table th {
  background: #ffb3b2;
  font-weight: 700;
}

.climbing-table tr:nth-child(even) {
  background: rgba(255, 120, 118, 0.08);
}

.climbing-table tr:hover {
  background: rgba(255, 120, 118, 0.16);
  transition: 0.2s ease;
}
</style>
