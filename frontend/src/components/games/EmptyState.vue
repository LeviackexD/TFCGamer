<script setup>
defineProps({
  message: { type: String, default: 'No hay juegos en tu backlog' },
})
</script>

<template>
  <div class="pixel-border bg-retro-dark p-8 sm:p-12 text-center animate-fade-in">
    <div class="font-pixel text-4xl sm:text-5xl text-retro-mute mb-4 opacity-30">
      [ <span class="text-retro-cyan opacity-50">_</span> ]
    </div>
    <p class="font-pixel text-xs sm:text-sm text-retro-mute mb-2">
      {{ message }}
    </p>
    <p class="font-body text-retro-mute text-xl">
      Parece que no hay nada por aquí...
    </p>
    <router-link
      to="/juegos/nuevo"
      class="inline-block mt-6 btn-retro bg-retro-cyan text-retro-black hover:shadow-glow-cyan"
    >
      + AÑADIR JUEGO
    </router-link>
  </div>
</template>
