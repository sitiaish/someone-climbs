<template>
  <div class="answer" :class="{ 'gf-theme': girlfriendMode }">

    <div class="answer-frame">
      <template v-if="!girlfriendMode || !hasReachedBottom">
        <p class="answer-headline">
          {{ countryCount - 1 }} countries, 1 on homeground.<br>15+ unique locations. <br>Zero regrets.
        </p>

        <p class="text-body-2">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum sint fuga, dolor consequuntur dicta nulla fugit facilis excepturi sequi fugiat adipisci id, sed alias architecto nobis laudantium, exercitationem et dignissimos.
        </p>
      </template>

      <template v-else>
        <p class="answer-headline">I also wna go to Japan and Australia...<br>just not for touching rocks haha</p>
        <p class="text-body-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident deleniti aut consequuntur officiis deserunt quis corrupti commodi maxime voluptatum est dignissimos sequi aperiam cupiditate quas, consequatur atque quaerat rem enim.
        </p>
      </template>
    </div>

    <div class="country-groups-section">
      <p class="section-label mb-4">by country - arranged in descending order of most trips </p>

      <div class="dot-legend mb-6">
        <span class="dot-legend-item">
          <span class="dot-swatch dot-boulder opacity-50" /> bouldering
        </span>
        <span class="dot-legend-item">
          <span class="dot-swatch dot-lead opacity-50" /> lead climbing
        </span>
      </div>

      <div class="country-groups">
        <div
          v-for="group in countriesWithLocations"
          :key="group.country"
          class="country-group"
        >
          <div class="cg-header">
            <span class="cg-flag">{{ flagEmoji(group.country) }}</span>
            <span class="cg-name ml-2">{{ group.country }}</span>
            <p class="cg-meta">Total trip{{ group.trips > 1 ? 's' : '' }}: {{ group.trips }}</p>
            <!-- <span class="cg-dot">·</span> -->
            <!-- <span class="cg-meta">{{ group.uniqueLocations }} location{{ group.uniqueLocations > 1 ? 's' : '' }}</span> -->
          </div>
          <div class="cg-chips">
            <div
              v-for="loc in group.locations"
              :key="loc.name"
              class="cg-chip"
              :class="loc.types.includes('Lead') && loc.types.includes('Bouldering') ? 'chip-both' : loc.types.includes('Lead') ? 'chip-lead' : 'chip-boulder'"
            >
              <span class="chip-name">{{ loc.name }}</span>
              <span class="chip-count">{{ loc.trips }}×</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div ref="bottomRef" class="bottom-sentinel" />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useClimbData } from '@/composables/useClimbData'

defineProps({
  girlfriendMode: { type: Boolean, default: false },
})

const { countriesData, climbs } = useClimbData()

const countryCount = computed(() => countriesData.value.length)

// Scroll-to-bottom detection via scroll listener on the answer-panel container
const bottomRef = ref(null)
const hasReachedBottom = ref(false)
let _cleanup = null

onMounted(() => {
  const scrollParent = bottomRef.value?.closest('.answer-panel')
  if (!scrollParent) return

  const onScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = scrollParent
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      hasReachedBottom.value = true
      scrollParent.removeEventListener('scroll', onScroll)
    }
  }

  scrollParent.addEventListener('scroll', onScroll, { passive: true })
  _cleanup = () => scrollParent.removeEventListener('scroll', onScroll)
})

onUnmounted(() => _cleanup?.())

const FLAGS = {
  Thailand:    '🇹🇭',
  Malaysia:    '🇲🇾',
  Japan:       '🇯🇵',
  Australia:   '🇦🇺',
  Indonesia:   '🇮🇩',
  'Hong Kong': '🇭🇰',
  Singapore:   '🇸🇬',
}

function flagEmoji(country) {
  return FLAGS[country] ?? '🏔️'
}

// Grouped by country with per-location trip counts and types
const countriesWithLocations = computed(() => {
  const map = {}
  climbs.forEach(c => {
    if (!map[c.country]) map[c.country] = {}
    const locs = map[c.country]
    if (!locs[c.location]) locs[c.location] = { trips: 0, types: new Set() }
    locs[c.location].trips++
    locs[c.location].types.add(c.type)
  })
  // Sort countries by total trips desc (same order as countriesData)
  return countriesData.value.map(({ country, trips }) => {
    const locs = map[country] || {}
    const locations = Object.entries(locs)
      .map(([name, d]) => ({ name, trips: d.trips, types: [...d.types] }))
      .sort((a, b) => b.trips - a.trips)
    return { country, trips, uniqueLocations: locations.length, locations }
  })
})

</script>

<style scoped>
.answer { display: flex; flex-direction: column; }
.bottom-sentinel { height: 1px; pointer-events: none; }

.answer-headline {
  font-family: 'Fira Code', monospace;
  color: #0163c6;
  line-height: 1.1;
  margin: 0;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0;
}

.section-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #1C1917;
  font-family: 'Fira Code', monospace;
}

/* Country groups flex wrap */
.country-groups-section { display: flex; flex-direction: column; }

.country-groups {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.country-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cg-flag { font-size: 18px; line-height: 1; }

.cg-name {
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  font-weight: 700;
  color: #222;
}

.cg-meta {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  color: #aaa;
}

.cg-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cg-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: default;
}

.chip-lead {
  background: #eef5ff;
  border-color: #c2d9f8;
}
.chip-boulder {
  background: #ffd6d5;
  border-color: #ff7876;
}
.chip-both {
  background: #f4f0ff;
  border-color: #d0c2f0;
}

.chip-name {
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

.chip-count {
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  color: #808080;
  font-weight: 600;
}
</style>
