<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGames } from '@/composables/useGames'
import GameForm from '@/components/games/GameForm.vue'

const router = useRouter()
const { createGame } = useGames()

const error = ref('')
const submitting = ref(false)

async function handleSubmit(data) {
  submitting.value = true
  error.value = ''
  try {
    await createGame(data)
    router.push('/juegos')
  } catch (err) {
    error.value = err.message || 'Error al crear el juego'
  } finally {
    submitting.value = false
  }
}

function handleCancel() {
  router.push('/juegos')
}
</script>

<template>
  <div class="max-w-2xl mx-auto animate-fade-in">
    <h1 class="font-pixel text-lg sm:text-xl text-retro-text mb-6">
      NUEVO JUEGO
    </h1>

    <p v-if="error" class="font-body text-retro-red text-lg text-center mb-4 pixel-border border-retro-red bg-retro-red/10 p-3">
      {{ error }}
    </p>

    <GameForm
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
