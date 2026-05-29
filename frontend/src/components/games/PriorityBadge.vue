<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: { type: Number, required: true },
})

const level = computed(() => {
  if (props.score >= 10) return 'high'
  if (props.score >= 5) return 'medium'
  return 'low'
})

const colors = {
  high: 'bg-retro-green text-retro-black',
  medium: 'bg-retro-yellow text-retro-black',
  low: 'bg-retro-mute text-retro-black',
}
</script>

<template>
  <span
    class="font-pixel text-[9px] px-2 py-1"
    :class="colors[level]"
    :title="`Prioridad: ${score}`"
  >
    {{ score }}
  </span>
</template>
