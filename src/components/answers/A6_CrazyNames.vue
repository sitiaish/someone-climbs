<template>
  <div class="answer" :class="{ 'gf-theme': girlfriendMode }">
    <div class="answer-frame">
      <template v-if="!girlfriendMode">
        <p class="answer-headline mb-5">Yes, genuinely unhinged.</p>

        <p class="text-body-2">
          these are real names, real places, real routes/rocks climbed by a real person... who then decided, 
          "Rock, I dub thee (see examples below)."
        </p>
      </template>

      <template v-else>
        <p class="answer-headline gf-headline">YASSS unhinged <br>(but not as much as i am)</p>
        <p class="text-body-2">
          he climbed a route called <i>"Are You Stupid Enough"</i>? that's actually a mood. And <i>"Mak Kau Hijau"</i> - cultured💅 i respect that.
        </p>
      </template>

      <div v-if="activeTab === 'routes'" class="callout-section mt-6">
        <p class="text-body-2 mb-1">I specially handpicked these</p>
        <div class="highlight-grid">
          <div v-for="name in highlightNames" :key="name" class="highlight-pill">
            {{ name }}
          </div>
        </div>
      </div>
    </div>

    <div class="answer-content">
      <div class="tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'routes' }"
          @click="activeTab = 'routes'"
        >
          routes
          <span class="tab-count">{{ allRouteNames.length }}</span>
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'crags' }"
          @click="activeTab = 'crags'"
        >
          crags &amp; areas
          <span class="tab-count">{{ cragAreaWords.length }}</span>
        </button>
      </div>

      <Transition name="tab-fade" mode="out-in">
        <div v-if="activeTab === 'routes'" key="routes" class="cloud-container">
          <span
            v-for="(name, i) in allRouteNames"
            :key="name"
            class="route-word"
            :style="routeWordStyle(i)"
            :title="name"
          >{{ name }}</span>
        </div>

        <!-- Tab 2: Crags & areas — weighted by frequency -->
        <div v-else key="crags" class="cloud-container">
          <span
            v-for="item in cragAreaWords"
            :key="item.word"
            class="crag-word"
            :style="cragWordStyle(item)"
            :title="`appears ${item.count}x`"
          >{{ item.word }}</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useClimbData } from '@/composables/useClimbData'

defineProps({
  girlfriendMode: { type: Boolean, default: false },
})

const { allRouteNames, cragAreaWords } = useClimbData()

const activeTab = ref('routes')

// Curated list of the genuinely unhinged names for the callout
const highlightNames = [
  'Mak Kau Hijau',
  'Septic Tank Yank',
  'Beached Whale',
  'Fish Head Soup',
  'Snooze You Lose',
  'Are You Stupid Enough',
  'Fat Blocker',
  'Love Me, Love My Route',
  'Show Off the Police',
  'Trust the Peanut',
]

// Deterministic pseudo-random from index — avoids layout shifts on re-render
function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

// Route word styles — random size, slight rotation, colour rotation
const ROUTE_COLOURS = ['#0163c6', '#ff7876', '#c94040', '#f0a500', '#2c8a4a']

function routeWordStyle(i) {
  const sizeBase = 12
  const sizeRange = 20
  const fontSize = sizeBase + Math.floor(seededRandom(i * 3) * sizeRange)
  const rotation = (seededRandom(i * 7) - 0.5) * 14 // -7 to +7 deg
  const colour = ROUTE_COLOURS[i % ROUTE_COLOURS.length]
  const opacity = 0.55 + seededRandom(i * 11) * 0.45

  return {
    fontSize: fontSize + 'px',
    transform: `rotate(${rotation.toFixed(1)}deg)`,
    color: colour,
    opacity: opacity,
    display: 'inline-block',
    margin: `${4 + Math.floor(seededRandom(i * 5) * 8)}px ${4 + Math.floor(seededRandom(i * 13) * 10)}px`,
    fontWeight: fontSize > 24 ? '700' : '500',
    lineHeight: '1.2',
    transition: 'opacity 0.15s, transform 0.15s',
  }
}

// Crag word styles — size proportional to frequency
function cragWordStyle(item) {
  const maxCount = Math.max(...cragAreaWords.value.map(w => w.count))
  const minSize = 13
  const maxSize = 64
  const fontSize = minSize + ((item.count / maxCount) ** 0.6) * (maxSize - minSize)
  const rotation = (seededRandom(item.word.length * 3) - 0.5) * 10
  const isBig = fontSize > 36

  return {
    fontSize: fontSize.toFixed(1) + 'px',
    transform: `rotate(${rotation.toFixed(1)}deg)`,
    color: isBig ? '#0163c6' : '#ff7876',
    fontWeight: isBig ? '700' : '500',
    display: 'inline-block',
    margin: `${6 + Math.floor(seededRandom(item.word.length) * 8)}px ${4 + Math.floor(seededRandom(item.word.length * 7) * 12)}px`,
    lineHeight: '1.2',
    opacity: 0.6 + (item.count / maxCount) * 0.4,
    transition: 'opacity 0.15s, transform 0.15s',
  }
}
</script>

<style scoped>
.answer { display: flex; flex-direction: column;}

/* Tabs */
.tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1.5px solid #f0f0f0;
  padding-bottom: 0;
}

.tab-btn {
  font-size: 13px;
  font-weight: 500;
  color: #aaa;
  background: none;
  border: none;
  padding: 8px 16px 12px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.15s;
  border-bottom: 2px solid transparent;
  margin-bottom: -1.5px;
}
.tab-btn:hover { color: #ff5f5d; }
.tab-btn.active {
  color: #ff7876;
  border-bottom-color: #ff7876;
}

.tab-count {
  font-size: 11px;
  background: #f0f0f0;
  color: #888;
  padding: 2px 6px;
  border-radius: 99px;
}
.tab-btn.active .tab-count {
  background: #ff7876;
  color: white;
}

/* Word clouds */
.cloud-container {
  min-height: 320px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 0;
  padding: 8px 0;
}

.route-word,
.crag-word {
  cursor: default;
  white-space: nowrap;
}

.route-word:hover,
.crag-word:hover {
  opacity: 1 !important;
  transform: rotate(0deg) scale(1.05) !important;
}

/* Highlight callout */
.callout-section { display: flex; flex-direction: column; gap: 10px; }

.highlight-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.highlight-pill {
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 99px;
  background: #fbe2b9;
  color: #c94040;
  border: 1px solid #ff7876;
}

/* Tab transition */
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.2s ease;
}
.tab-fade-enter-from,
.tab-fade-leave-to {
  opacity: 0;
}
</style>
