<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGames } from '@/composables/useGames'
import GameForm from '@/components/games/GameForm.vue'

const route = useRoute()
const router = useRouter()
const { getGameById, updateGame } = useGames()

const game = ref(null)
const error = ref('')
const submitError = ref('')
const submitting = ref(false)

onMounted(async () => {
  try {
    game.value = await getGameById(Number(route.params.id))
  } catch (err) {
    error.value = err.message || 'Juego no encontrado'
  }
})

async function handleSubmit(data) {
  submitting.value = true
  submitError.value = ''
  try {
    await updateGame(game.value.id, data)
    router.push('/juegos')
  } catch (err) {
    submitError.value = err.message || 'Error al actualizar el juego'
  } finally {
    submitting.value = false
  }
}

function handleCancel() {
  router.push('/juegos')
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <div v-if="error" class="pixel-border bg-retro-dark p-6 text-center animate-fade-in">
      <p class="font-pixel text-sm text-retro-red">{{ error }}</p>
      <router-link
        to="/juegos"
        class="inline-block mt-4 btn-retro bg-retro-cyan text-retro-black"
      >
        VOLVER
      </router-link>
    </div>

    <template v-else-if="game">
      <h1 class="font-pixel text-lg sm:text-xl text-retro-text mb-6">
        EDITAR: {{ game.name.toUpperCase() }}
      </h1>

      <p v-if="submitError" class="font-body text-retro-red text-lg text-center mb-4 pixel-border border-retro-red bg-retro-red/10 p-3">
        {{ submitError }}
      </p>

      <GameForm
        :game="game"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </template>

    <div v-else class="text-center py-12">
      <p class="font-pixel text-sm text-retro-cyan animate-pulse">CARGANDO...</p>
    </div>
  </div>
</template>
