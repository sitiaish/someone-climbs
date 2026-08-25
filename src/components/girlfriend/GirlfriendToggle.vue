<template>
  <div class="gf-toggle-root">
    <Transition name="bubble-pop">
      <div v-if="isActive" class="speech-bubble">
        <Transition name="line-swap" mode="out-in">
          <div :key="reaction.line" class="bubble-content">
            <p class="bubble-line">{{ reaction.line }}</p>
            <p class="bubble-subline">{{ reaction.subline }}</p>
          </div>
        </Transition>
        <!-- Dismiss -->
        <button class="bubble-dismiss" @click="dismiss" aria-label="dismiss">✕</button>
      </div>
    </Transition>

    <button
      class="gf-btn"
      :class="{ active: isActive }"
      @click="toggle"
      :title="isActive ? 'turn off girlfriend mode' : 'girlfriend mode'"
    >
      <GirlfriendSprite :expression="isActive ? reaction.expression : 'judging'" />
      <span class="gf-btn-label" :class="{ 'hidden': isActive }">{{ isActive ? '' : 'girlfriend mode' }}</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import GirlfriendSprite from './GirlfriendSpriteImg.vue'
import { useGirlfriend } from '@/composables/useGirlfriend'

const props = defineProps({
  // current question id e.g. 'Q1' — so the reaction updates as user navigates
  activeQuestionId: {
    type: String,
    default: 'Q1',
  },
})

const { isActive, toggle, dismiss, getReaction } = useGirlfriend()

const reaction = computed(() => getReaction(props.activeQuestionId))
</script>

<style scoped>
.gf-toggle-root {
  position: absolute;
  bottom: 28px;
  right: 24px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  width: max-content;
}

/* ── Speech bubble ─────────────────────────────────────────── */

.speech-bubble {
  position: relative;
  background: #fff;
  border: 1.5px solid #e8388a;
  border-radius: 12px;
  padding: 14px 40px 14px 16px;
  max-width: 260px;
  box-shadow: 0 4px 20px rgba(255, 120, 118, 0.15);
}

/* Tail pointing down-right */
.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  right: 24px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 10px solid #e8388a;
}
.speech-bubble::before {
  content: '';
  position: absolute;
  bottom: -8px;
  right: 25px;
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 9px solid white;
  z-index: 1;
}

.bubble-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bubble-line {
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  font-weight: 600;
  color: #e8388a;
  margin: 0;
  line-height: 1.4;
}

.bubble-subline {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  color: #aaa;
  margin: 0;
  font-style: italic;
  line-height: 1.4;
}

.bubble-dismiss {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 11px;
  color: #ccc;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  line-height: 1;
  transition: color 0.15s;
}
.bubble-dismiss:hover { color: #ff7876; }

/* ── Toggle button ─────────────────────────────────────────── */

.gf-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 8px 8px;
  background: white;
  border: 1.5px solid #e8388a;
  border-radius: 99px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  box-shadow: 0 2px 12px rgba(255, 120, 118, 0.12);
}

.gf-btn:hover {
  background: #fff5f5;
  box-shadow: 0 4px 20px rgba(255, 120, 118, 0.2);
  transform: translateY(-1px);
}

.gf-btn.active {
  background: #fff5f5;
  border-color: #e8388a;
  box-shadow: 0 4px 20px rgba(201, 64, 64, 0.2);
}

.gf-btn-label {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  font-weight: 600;
  color: #e8388a;
  white-space: nowrap;
}

/* ── Transitions ───────────────────────────────────────────── */

/* Bubble appears with a little bounce */
.bubble-pop-enter-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.bubble-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.bubble-pop-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}
.bubble-pop-leave-to {
  opacity: 0;
  transform: translateY(4px) scale(0.97);
}

/* Reaction text swaps with a quick fade */
.line-swap-enter-active,
.line-swap-leave-active {
  transition: opacity 0.15s ease;
}
.line-swap-enter-from,
.line-swap-leave-to {
  opacity: 0;
}
</style>
