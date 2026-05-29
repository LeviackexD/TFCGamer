<script setup>
defineProps({
  sortBy: { type: String, default: 'priorityScore' },
  order: { type: String, default: 'desc' },
})

const emit = defineEmits(['update'])

const sortOptions = [
  { value: 'priorityScore', label: 'Prioridad' },
  { value: 'metacriticScore', label: 'Puntuación' },
  { value: 'hoursToBeat', label: 'Horas' },
  { value: 'name', label: 'Nombre' },
]
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <span class="font-pixel text-[10px] text-retro-mute uppercase">
      Ordenar por:
    </span>

    <div class="flex flex-wrap gap-1">
      <button
        v-for="opt in sortOptions"
        :key="opt.value"
        class="font-pixel text-[9px] sm:text-[10px] px-3 py-2 transition-all duration-200"
        :class="sortBy === opt.value
          ? 'bg-retro-cyan text-retro-black'
          : 'bg-retro-dark text-retro-mute border border-retro-border hover:border-retro-cyan'"
        @click="emit('update', { sortBy: opt.value })"
      >
        {{ opt.label }}
      </button>
    </div>

    <button
      class="font-pixel text-[10px] px-3 py-2 bg-retro-dark border border-retro-border text-retro-mute hover:border-retro-cyan transition-all duration-200"
      @click="emit('update', { order: order === 'asc' ? 'desc' : 'asc' })"
    >
      {{ order === 'asc' ? '↑ ASC' : '↓ DESC' }}
    </button>
  </div>
</template>
