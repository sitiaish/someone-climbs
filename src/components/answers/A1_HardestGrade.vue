<template>
  <div class="answer" :class="{ 'gf-theme': girlfriendMode }">
    <div class="answer-frame">
      <template v-if="!girlfriendMode">
        <p class="answer-headline">The hardest grade is {{ hardestRoute.Grade }}!</p>

        <p class="text-body-2 mb-4">
          at least for outdoor lead~! 
          The route is called <strong>{{ hardestRoute.Route }}</strong> at {{ hardestRoute.Crag }},
          {{ hardestRoute.Location }}, and it's sent as an
          <span :class="['tick-badge', tickClass(hardestRoute.Finish)]">
            {{ hardestRoute.Finish === 'Red point' ? 'redpoint' : hardestRoute.Finish.toLowerCase() }}
          </span>.
        </p>

        <p class="text-body-2">
          For context, world-class climbers do 9c! See the full French grade spectrum below. Apparently, there's also other types of grade scales in climbing like the V-scale for bouldering too!
        </p>
      </template>

      <template v-else>
        <p class="answer-headline gf-headline">Ok fineeeee...{{ hardestRoute.Grade }} is hard!~</p>
        <p class="text-body-2 mb-2">
          don't tell him i said that.
        </p>
        <p class="text-body-2">
          i will not be dragged to the crag to watch him flail on it, thanks. but i will allez him from the comfort of my living room ~allez tho~
        </p>
      </template>
    </div>

    <!-- Grade ladder -->
    <div class="grade-ladder mb-12">
      <p class="section-label">All outdoor lead attempts and where {{ hardestRoute.Grade }} sits</p>
      <div class="ladder-track">
        <div
          v-for="g in gradeDistribution"
          :key="g.grade"
          class="ladder-item"
          :class="{ 'is-hardest': g.grade === normaliseGrade(hardestRoute.Grade) }"
        >
          <div class="ladder-bar-wrap">
            <div
              class="ladder-bar"
              :style="{ height: barHeight(g.count) }"
              :class="{ 'is-hardest': g.grade === normaliseGrade(hardestRoute.Grade) }"
            />
          </div>
          <span class="ladder-label">{{ g.grade }}</span>
          <span class="ladder-count">{{ g.count }}</span>
        </div>
      </div>
    </div>

    <!-- Full grade spectrum context strip -->
    <div class="spectrum-section">
      <p class="section-label">full french grade spectrum</p>
      <div class="spectrum-strip">
        <div
          v-for="g in GRADE_ORDER"
          :key="g"
          class="spectrum-cell"
          :class="{
            'has-routes': gradeCounts[g],
            'is-hardest': g === normaliseGrade(hardestRoute.Grade),
          }"
        >
          <span class="spectrum-label">{{ g }}</span>
        </div>
      </div>
      <div class="spectrum-legend">
        <p><span class="legend-dot climbed" /> What he'd climbed</p>
        <p><span class="legend-dot hardest" /> The hardest he'd climbed</p>
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

const { hardestRoute, gradeDistribution, GRADE_ORDER, normaliseGrade } = useClimbData()

// Build a quick lookup of grade → count for spectrum strip
const gradeCounts = computed(() => {
  const map = {}
  gradeDistribution.value.forEach(g => { map[g.grade] = g.count })
  return map
})

const maxCount = computed(() =>
  Math.max(...gradeDistribution.value.map(g => g.count))
)

function barHeight(count) {
  const pct = (count / maxCount.value) * 100
  return `${Math.max(pct, 8)}px`
}

function tickClass(finish) {
  if (finish === 'Onsight')   return 'tick-os'
  if (finish === 'Flash')     return 'tick-fl'
  if (finish === 'Red point') return 'tick-rp'
  return ''
}
</script>

<style scoped>
.answer { display: flex; flex-direction: column; }

.tick-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 99px;
  font-size: 13px;
  font-weight: 500;
}
.tick-os { background: #e8f4ff; color: #0163c6; }
.tick-fl { background: #fff3cd; color: #c94040; }
.tick-rp { background: #fbe2b9; color: #c94040; }

/* Grade ladder */
.grade-ladder { display: flex; flex-direction: column; gap: 12px;}

.section-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #1C1917;
  font-family: 'Fira Code', monospace;
  margin-bottom: 8px;
}

.ladder-track {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.ladder-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 32px;
}

.ladder-bar-wrap {
  display: flex;
  align-items: flex-end;
  height: 80px;
}

.ladder-bar {
  width: 28px;
  background: #fbe2b9;
  border-radius: 4px 4px 0 0;
  transition: height 0.6s ease;
  min-height: 8px;
}
.ladder-bar.is-hardest { background: #ff7876; }

.ladder-label {
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  color: #888;
  white-space: nowrap;
  transform: translateX(-4px) rotate(-40deg);
  transform-origin: top center;
  margin-top: 4px;
}

.ladder-item.is-hardest .ladder-label { color: #ff7876; font-weight: 700; }

.ladder-count {
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  color: #ccc;
}

/* Spectrum strip */
.spectrum-section { display: flex; flex-direction: column; gap: 10px; }

.spectrum-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.spectrum-cell {
  padding: 4px 8px;
  border-radius: 4px;
  background: #f5f5f5;
  border: 1px solid transparent;
}
.spectrum-cell.has-routes {
  background: #fbe2b9;
  border-color: #ff7876;
}
.spectrum-cell.is-hardest {
  background: #ff7876;
  border-color: #ff7876;
}

.spectrum-label {
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  color: #bbb;
}
.spectrum-cell.has-routes .spectrum-label { color: #c94040; }
.spectrum-cell.is-hardest .spectrum-label { color: white; font-weight: 700; }

.spectrum-legend {
  display: flex;
  align-items: center;
  gap: 24px;
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  color: #1C1917;
  margin-top: 8px;
}
.legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  margin-right: 4px;
}
.legend-dot.climbed { background: #fbe2b9; border: 1px solid #ff7876; }
.legend-dot.hardest { background: #ff7876; }
</style>