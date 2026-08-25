<template>
  <section class="cards max-w-[1380px] mx-auto p-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <RouteCard
      v-for="item in items"
      :key="item.Route + item.Date"
      :item="item"
    />
  </section>
</template>

<script setup>
import RouteCard from "./RouteCard.vue"

defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>