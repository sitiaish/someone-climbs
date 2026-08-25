<template>
  <div class="answer" :class="{ 'gf-theme': girlfriendMode }">

    <div class="answer-frame">
      <template v-if="!girlfriendMode">
        <p class="answer-headline">
          Squiggly lines galore; arranged by most recent!
        </p>

        <p class="text-body-2">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum sint fuga, dolor consequuntur dicta nulla fugit facilis excepturi sequi fugiat adipisci id, sed alias architecto nobis laudantium, exercitationem et dignissimos.
        </p>
      </template>

      <template v-else>
        <p class="answer-headline">ok...but what am i looking at? what are these wiggly lines he calls hobby?</p>
        <p class="text-body-2">
          sure. this is what sport climbing looks like, apparently.
        </p>
      </template>
    </div>

    <!-- Route scatter -->
    <div class="routes-grid">
      <div
        v-for="(route, i) in svgRoutes"
        :key="route.name"
        class="route-tile"
        :class="{ hovered: hoveredIndex === i }"
        @mouseenter="hoveredIndex = i"
        @mouseleave="hoveredIndex = null"
      >
        <!-- Grade badge -->
        <span class="grade-badge" :class="gradeColor(route.grade)">{{ route.grade }}</span>

        <!-- SVG line -->
        <svg
          viewBox="0 0 250 350"
          class="route-svg"
          :ref="el => setSvgRef(el, i)"
        >
          <path
            :d="route.d"
            class="route-path"
            :class="[`finish-${finishClass(route.finish)}`, { animated: animatedSet.has(i) }]"
          />
        </svg>

        <!-- Tooltip on hover -->
        <Transition name="tooltip-fade">
          <div v-if="hoveredIndex === i" class="route-tooltip">
            <strong>{{ route.name }}</strong>
            <span>{{ route.crag }}</span>
            <span>{{ route.location }}</span>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useClimbData } from '@/composables/useClimbData'

defineProps({
  girlfriendMode: { type: Boolean, default: false },
})

const { svgRoutes } = useClimbData()

const hoveredIndex = ref(null)
const animatedSet  = ref(new Set())
const svgRefs      = ref([])

function setSvgRef(el, i) {
  if (el) svgRefs.value[i] = el
}

// Staggered draw-on animation when component mounts
onMounted(async () => {
  await nextTick()
  svgRoutes.value.forEach((_, i) => {
    setTimeout(() => {
      const next = new Set(animatedSet.value)
      next.add(i)
      animatedSet.value = next
    }, i * 60) // 60ms stagger per route
  })
})

function finishClass(finish) {
  if (finish === 'Onsight')   return 'os'
  if (finish === 'Flash')     return 'fl'
  if (finish === 'Red point') return 'rp'
  return 'rp'
}

function gradeColor(grade) {
  // Rough difficulty banding for badge colour
  const rank = gradeToRank(grade)
  if (rank <= 10) return 'grade-easy'    // up to 6a
  if (rank <= 13) return 'grade-mid'     // 6a+ to 6b+
  if (rank <= 15) return 'grade-hard'    // 6c to 6c+
  return 'grade-top'                     // 7a+
}

function gradeToRank(g) {
  const order = [
    '5a','5a+','5b','5b+','5c','5c+',
    '6a','6a+','6b','6b+','6c','6c+',
    '7a','7a+','7b','7b+',
  ]
  return order.indexOf(g)
}
</script>

<style scoped>
.answer { display: flex; flex-direction: column;  }

/* Grid */
.routes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 12px;
}

@media screen and (max-width: 640px) {
  .routes-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
}


.route-tile {
  position: relative;
  background: #fbe2b9;
  border: 1.5px solid #ff7876;
  border-radius: 8px;
  overflow: hidden;
  cursor: default;
  transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s;
  aspect-ratio: 5 / 7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.route-tile.hovered {
  transform: translateY(-3px);
  border-color: #0163c6;
  box-shadow: 0 6px 20px rgba(1, 99, 198, 0.12);
  z-index: 2;
}

.grade-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  z-index: 2;
}
.grade-easy { background: #e8f4ff; color: #0163c6; }
.grade-mid  { background: #fbe2b9; color: #c94040; }
.grade-hard { background: #ffcaca; color: #a00000; }
.grade-top  { background: #0163c6; color: white; }

/* SVG path */
.route-svg {
  width: 100%;
  height: 100%;
}

.route-path {
  fill: none;
  stroke-width: 7;
  stroke-opacity: 0.6;
  stroke-linecap: round;
  stroke-dasharray: 1200;
  stroke-dashoffset: 1200;
  transition: stroke-dashoffset 1.2s ease;
}

/* Draw-on trigger */
.route-path.animated {
  stroke-dashoffset: 0;
}

/* Colour by tick type */
.finish-os { stroke: #0163c6; }
.finish-fl { stroke: #f0a500; }
.finish-rp { stroke: #ff4d4f; }

/* Tooltip */
.route-tooltip {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(1, 99, 198, 0.92);
  color: white;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  backdrop-filter: blur(4px);
}

.route-tooltip strong {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.3;
}

.route-tooltip span {
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  opacity: 0.8;
}

/* Tooltip transition */
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* Bottom count */
.route-count {
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  color: #bbb;
  font-style: italic;
  margin: 0;
}

</style>
