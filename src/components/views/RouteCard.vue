<template>
  <a class="card" :href="item.Link" target="_blank">
    <div class="absolute right-3 bottom-5 z-[-1]">
      <svg viewBox="0 0 250 350">
        <path
          :d="item['D']"
          class="route-line"
        />
      </svg>
    </div>

    <div class="top-grade-stamp">
      <p>{{ item.Grade }}</p>
    </div>

    <div class="top-card">
      <p class="text-header-2">{{ item.Route }}</p>
      <p class="text-header-3">{{ item.Crag }} in {{ item.Area }}</p>
    </div>

    <div class="middle-card">
      <p>{{ item['Gear Distance'] ?? '??' }} m</p>
      <p>{{ item['No. of Clips'] ?? '??' }} clips</p>
    </div>

    <div class="bottom-card">
      <div class="grade-stamp">
        <svg viewBox="0 0 200 200" width="200" height="200">
          <defs>
            <path id="circle-top" d="M 30 100 A 70 70 0 0 1 170 100" />
            <path id="circle-bottom" d="M 170 100 A 70 70 0 0 1 30 100" />
          </defs>

          <circle cx="100" cy="100" r="60" fill="none" stroke="black" stroke-width="1" />

          <!-- TOP TEXT -->
          <text font-size="16" font-weight="bold" letter-spacing="2" text-anchor="middle">
            <textPath href="#circle-top" startOffset="50%">
              {{ item.Finish }} • {{ item.Finish }} • {{ item.Finish === 'Flash' ? 'Flash' : '' }}
            </textPath>
          </text>

          <!-- BOTTOM TEXT -->
          <text font-size="14" font-weight="bold" letter-spacing="2" text-anchor="middle">
            <textPath href="#circle-bottom" startOffset="50%">
              {{ item.Finish }} • {{ item.Finish }} • {{ item.Finish === 'Flash' ? 'Flash' : '' }}
            </textPath>
          </text>
        </svg>
      </div>

      <div>
        <p class="text-body-3">Location</p>
        <p class="text-body-1">{{ item.Location }}, {{ item.Country }}</p>
      </div>

      <div>
        <p class="text-body-3">Date</p>
        <p class="text-body-1">{{ paddedMonth(item.Month) }}/{{ item.Year }}</p>
      </div>
    </div>
  </a>
</template>

<script setup>
defineProps({
  item: Object,
})

function paddedMonth(m) {
  return m < 10 ? '0' + m : m
}
</script>

<style scoped>
.route-viz {
  margin-top: 16px;
}

svg {
  width: 100%;
  height: 200px;
}

.route-line {
  fill: none;
  stroke: #ff4d4f;
  stroke-width: 8;
  stroke-opacity: 0.6;
  stroke-dasharray: 800;
  stroke-dashoffset: 800;
  stroke-linecap: round;
  transition: stroke-dashoffset 1.4s ease;
}

.card:hover .route-line {
  stroke-dashoffset: 0;
}

.card {
  padding: 16px;
  padding-top: 32px;
  border: 1.5px solid #ff7876;
  background: #fbe2b9;
  transition: transform 0.2s ease;
  font-family: 'Fira Code', monospace;
  position: relative;
  overflow: hidden;
}

.top-card,
.bottom-card {
  color: #0163c6;
}

.top-grade-stamp {
  position: absolute;
  right: 8px;
  top: 8px;
}

.grade-stamp {
  position: absolute;
  right: -64px;
  top: -82px;
  transform: scale(0.75);
  opacity: 0.4;
}

.top-grade-stamp p {
  font-family: 'Fira Code', monospace;
  font-size: 28px;
  font-weight: 700;
  color: #ff7876;
  opacity: 0.5;
}

.bottom-card {
  margin-top: 54px;
  display: flex;
  justify-content: space-between;
  position: relative;
}

.middle-card {
  display: flex;
  justify-content: flex-start;
  gap: 24px;
  margin-top: 12px;
}

.middle-card p {
  background-color: #ff7876;
  color: white;
  border-radius: 32px;
  padding: 8px 16px;
}

.text-header-2 {
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
}

.text-header-3 {
  font-size: 20px;
  font-weight: 400;
}

.text-body-1 {
  font-size: 18px;
  font-weight: 400;
}

.text-body-1 {
  font-size: 16px;
  font-weight: 400;
}

.text-body-3 {
  font-size: 12px;
  font-weight: 400;
}

.card:hover {
  transform: translateY(-1px);
}

.category {
  font-size: 0.85rem;
  opacity: 0.6;
}

/* Data Viz */

.viz-row {
  margin-bottom: 1rem;
}

.bar {
  height: 20px;
  background: var(--accent);
  transition: width 0.4s ease;
}

/* Accessibility & Low Energy */

[v-cloak] {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  .card,
  .bar {
    transition: none;
  }
}
</style>
