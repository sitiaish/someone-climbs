<script setup>
import { ref, computed } from 'vue'
import QuestionAndAnswer from './components/views/QuestionAndAnswer.vue'
import Landing from './components/views/Landing.vue'
import About from './components/views/About.vue'
import Extras from './components/views/Extras.vue'

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
  window.scrollTo({ top: 0, behavior: 'instant' })
})

const route = computed(() => currentPath.value.slice(1) || '/')
</script>

<template>
  <template v-if="route === '/'">
    <nav class="site-nav">
      <a href="#/about" class="about-nav">about</a>
    </nav>
    <Landing />
    <QuestionAndAnswer />
  </template>

  <About v-else-if="route === '/about'" />
  <Extras v-else-if="route === '/extras'" />
</template>

<style scoped>
.site-nav {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px 0;
  background: #fffdf8;
}

.about-nav {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  font-weight: 600;
  color: #aaa;
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 99px;
  border: 1px solid #eee;
  transition: color 0.15s, border-color 0.15s;
}
.about-nav:hover {
  color: #e8388a;
  border-color: #e8388a;
}
</style>
