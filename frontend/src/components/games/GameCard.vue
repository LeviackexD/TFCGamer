<script setup>
import { ref, watch } from 'vue'
import PriorityBadge from './PriorityBadge.vue'
import GameActions from './GameActions.vue'

const props = defineProps({
  game: { type: Object, required: true },
})

defineEmits(['edit', 'delete', 'complete', 'uncomplete'])

const showStamp = ref(false)

watch(() => props.game.completed, (val) => {
  if (val) {
    showStamp.value = true
    setTimeout(() => { showStamp.value = false }, 3000)
  }
})
</script>

<template>
  <div
    class="pixel-border-retro bg-retro-dark transition-all duration-300 animate-fade-in relative overflow-hidden group"
    :class="{
      'border-retro-green/60 hover:shadow-glow-green/20': game.completed,
      'hover:shadow-glow-cyan/20': !game.completed,
    }"
  >
    <!-- Stamp overlay -->
    <div
      v-if="showStamp"
      class="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
    >
      <div
        class="stamp-rotate"
        :class="showStamp ? 'stamp-impact' : ''"
      >
        <div class="font-pixel text-[10px] sm:text-xs bg-retro-green text-retro-black px-6 py-3 border-2 border-retro-green shadow-lg"
          style="box-shadow: 0 0 20px rgba(95, 207, 128, 0.5), 4px 4px 0px rgba(0,0,0,0.3)"
        >
          COMPLETADO
        </div>
      </div>
    </div>

    <!-- Glow line at top -->
    <div
      class="absolute top-0 inset-x-0 h-0.5 transition-all duration-500"
      :class="game.completed
        ? 'bg-gradient-to-r from-transparent via-retro-green/60 to-transparent'
        : 'bg-gradient-to-r from-transparent via-retro-cyan/30 to-transparent'"
    />

    <!-- Completed corner flag -->
    <div
      v-if="game.completed"
      class="absolute top-0 right-0 z-30 flex flex-col items-end"
    >
      <div class="bg-retro-green text-retro-black font-pixel text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 sm:py-1 leading-none border-b-2 border-retro-green/50 shadow-sm">
        ✓
      </div>
      <div class="w-0 h-0 border-l-[18px] sm:border-l-[22px] border-b-[6px] sm:border-b-[8px] border-l-retro-green border-b-transparent opacity-90" />
    </div>

    <div class="p-4 sm:p-5">
      <div class="flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <h3 class="font-pixel text-xs sm:text-sm text-retro-text truncate">
            {{ game.name }}
          </h3>
          <div class="flex flex-wrap items-center gap-2 mt-2">
            <span class="font-body text-retro-cyan text-lg sm:text-xl bg-retro-black/50 px-2 py-0.5 border border-retro-border">
              {{ game.category }}
            </span>
            <PriorityBadge :score="game.priorityScore" />
            <span
              v-if="game.completed"
              class="font-pixel text-[9px] bg-retro-green text-retro-black px-2 py-1"
            >
              COMPLETADO
            </span>
          </div>
        </div>

        <GameActions
          :game="game"
          @edit="$emit('edit', game.id)"
          @delete="$emit('delete', game)"
          @complete="$emit('complete', game.id)"
          @uncomplete="$emit('uncomplete', game.id)"
        />
      </div>

      <!-- Tags -->
      <div class="mt-3 flex flex-wrap gap-1.5">
        <span
          v-for="tag in game.tags.split(',')"
          :key="tag"
          class="font-body text-base text-retro-mute bg-retro-black/30 px-2 border border-retro-border/30"
        >
          #{{ tag.trim() }}
        </span>
      </div>

      <!-- Stats -->
      <div class="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
        <div class="bg-retro-black/30 px-3 py-2 border border-retro-border/50">
          <p class="font-body text-sm text-retro-mute">Meta</p>
          <p class="font-pixel text-sm text-retro-yellow">{{ game.metacriticScore }}</p>
        </div>
        <div class="bg-retro-black/30 px-3 py-2 border border-retro-border/50">
          <p class="font-body text-sm text-retro-mute">Horas</p>
          <p class="font-pixel text-sm text-retro-cyan">{{ game.hoursToBeat }}h</p>
        </div>
      </div>

      <!-- Notes & Rating -->
      <div v-if="game.notes || game.rating" class="mt-3 pt-3 border-t border-retro-border/50">
        <p v-if="game.notes" class="font-body text-base sm:text-lg text-retro-mute italic">
          "{{ game.notes }}"
        </p>
        <div v-if="game.rating" class="mt-1 flex items-center gap-1">
          <span
            v-for="star in 5"
            :key="star"
            class="font-pixel text-lg"
            :class="star <= game.rating ? 'text-retro-yellow text-glow-yellow' : 'text-retro-mute opacity-20'"
          >
            ★
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
