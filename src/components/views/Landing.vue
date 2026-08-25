<template>
  <main>
     <article class="max-w-[640px] mx-auto">
      <p class="text-body-3 mb-4">  
        this experience is best viewed on desktop~
      </p>  

      <div class="content-block font-fira mb-12">
        <p class="text-body-2 mb-0">  
          Disclaimer: This is a playful exploration of their climbing adventures, from the perspective of someone who is not a climber. It’s not meant to be taken too seriously!
        </p>
      </div>

      <hr class="mb-12">

      <div class="content-block font-fira">
        <p class="text-body-2 text-center mb-4">
          They love climbing rocks.
        </p>

        <p class="text-body-2">
          On their Substack, Instagram and their <em>TheCrag</em> logbook, they log their climb journey:
          the routes, the journal, the videos, the trip reels.
        </p>

        <p class="text-body-2">
          On their dating app profile, they said,
          <br />
        </p>
        <p class="text-body-2 speech cursor-pointer"
          @mouseenter="spawnWords('🧗🏼')"
          @mouseleave="clearWords">
          “I spend my holidays climbing outdoors.”
        </p>
        
        <p class="text-body-2">
          Et voilà! A little investigation into his climbing adventures from some of the questions that I have as a not-a-climber. 
        </p>
      </div>
    </article>
  </main>
</template>

<script setup>
import { ref } from "vue"

const noElements = ref([])

const annotationRef = ref(null)
const calloutVisible = ref(false)
const calloutStyle = ref({})

function showCallout() {
  const rect = annotationRef.value?.getBoundingClientRect()
  if (rect) {
    calloutStyle.value = { top: (rect.top + rect.height / 2) + 'px', left: (rect.right + rect.height / 2) + 'px' }
  }
  calloutVisible.value = true
}

function hideCallout() {
  calloutVisible.value = false
}

function createWord(text) {
  const el = document.createElement('div')
  el.className = 'no-word'
  el.innerText = text

  const blockRect = document.querySelector('.content-block')?.getBoundingClientRect()
  let x, y
  do {
    x = Math.random() * window.innerWidth
    y = Math.random() * window.innerHeight
  } while (blockRect && x > blockRect.left && x < blockRect.right && y > blockRect.top && y < blockRect.bottom)

  el.style.left = x + 'px'
  el.style.top = y + 'px'
  el.style.fontSize = (Math.random() * 40 + 16) + 'px'
  el.style.transform = `rotate(${Math.random() * 360}deg)`

  document.body.appendChild(el)
  noElements.value.push(el)
}

function spawnWords(text) {
  for (let i = 0; i < 20; i++) {
    createWord(text)
  }
}

function clearWords() {
  noElements.value.forEach(el => el.remove())
  noElements.value = []
}

</script>

<style scoped>
main {
  padding: 48px 24px 72px;
}

@media screen and (max-width: 640px) {
  .speech {
    margin: 28px auto;
  }
}
</style>

<style>
.no-word {
  position: fixed;
  font-weight: 900;
  pointer-events: none;
  user-select: none;
  animation: fadeIn 0.3s ease;
  color: #e8388a;
  font-weight: 600;
  font-family: 'Gloria Hallelujah', cursive;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.5) rotate(-10deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

p.speech {
	position: relative;
	max-width: 28em;
  margin: 0 auto;
  margin-bottom: 24px;
	background-color: #fff;
	padding: 1.125em 1.5em;
	border-radius: 1rem;
  box-shadow:	0 0.125rem 0.5rem #ccc, 0 0.0625rem 0.125rem #ccc;
}

.annotation-trigger {
  text-decoration: underline;
  text-decoration-style: dotted;
  cursor: default;
  text-underline-offset: 3px;
  cursor: pointer;
}

.annotation-callout {
  position: fixed;
  right: 2rem;
  transform: translateY(-50%);
  width: 120px;
  pointer-events: none;
}

.annotation-callout img {
  width: 100%;
  height: auto;
  display: block;
}

.callout-enter-active,
.callout-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.callout-enter-from,
.callout-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(12px);
}


hr {
  border: 0;
  height: 1px;
  background: #ccc;
}

article .text-body-1 { line-height: 1.8; }
article .text-body-2 { line-height: 1.8; }
</style>
