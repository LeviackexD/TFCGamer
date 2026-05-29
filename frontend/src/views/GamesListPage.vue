<script setup>
import { ref, onMounted } from 'vue'
import { useGames } from '@/composables/useGames'
import GameCard from '@/components/games/GameCard.vue'
import GameFilters from '@/components/games/GameFilters.vue'
import GameSort from '@/components/games/GameSort.vue'
import EmptyState from '@/components/games/EmptyState.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const {
  games, loading, error, filters,
  loadGames, deleteGame, completeGame, uncompleteGame, setFilters,
} = useGames()

const gameToDelete = ref(null)
const showDeleteModal = ref(false)
const showCompleteModal = ref(false)
const gameToCompleteId = ref(null)
const completeRating = ref(0)
const completeNotes = ref('')
const actionError = ref('')

onMounted(() => loadGames())

async function handleDelete(game) {
  gameToDelete.value = game
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!gameToDelete.value) return
  actionError.value = ''
  try {
    await deleteGame(gameToDelete.value.id)
    showDeleteModal.value = false
    gameToDelete.value = null
  } catch (err) {
    actionError.value = err.message || 'Error al eliminar el juego'
  }
}

function handleComplete(id) {
  gameToCompleteId.value = id
  showCompleteModal.value = true
}

async function confirmComplete() {
  if (!showCompleteModal.value) return
  actionError.value = ''
  try {
    await completeGame(gameToCompleteId.value, {
      rating: completeRating.value || null,
      notes: completeNotes.value || null,
    })
    showCompleteModal.value = false
    completeRating.value = 0
    completeNotes.value = ''
  } catch (err) {
    actionError.value = err.message || 'Error al completar el juego'
  }
}

async function handleUncomplete(id) {
  actionError.value = ''
  try {
    await uncompleteGame(id)
  } catch (err) {
    actionError.value = err.message || 'Error al deshacer completado'
  }
}

async function handleFiltersUpdate(newFilters) {
  await setFilters(newFilters)
}

async function handleSortUpdate(newSort) {
  await setFilters(newSort)
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-pixel text-lg sm:text-xl text-retro-text">
          MIS JUEGOS
        </h1>
        <p class="font-body text-retro-mute text-xl mt-1">
          {{ games.length }} juego{{ games.length !== 1 ? 's' : '' }} en tu backlog
        </p>
      </div>
      <router-link
        to="/juegos/nuevo"
        class="btn-retro bg-retro-cyan text-retro-black hover:shadow-glow-cyan text-[10px] sm:text-xs"
      >
        + NUEVO
      </router-link>
    </div>

    <GameFilters
      :filters="filters"
      @update="handleFiltersUpdate"
    />

    <GameSort
      :sort-by="filters.sortBy"
      :order="filters.order"
      @update="handleSortUpdate"
    />

    <div v-if="loading" class="text-center py-12">
      <p class="font-pixel text-sm text-retro-cyan animate-pulse">
        CARGANDO...
      </p>
    </div>

    <div v-else-if="error" class="text-center py-12 pixel-border bg-retro-dark p-6">
      <p class="font-body text-retro-red text-lg">{{ error }}</p>
      <BaseButton variant="primary" class="mt-4" @click="loadGames">
        REINTENTAR
      </BaseButton>
    </div>

    <div v-else-if="games.length === 0">
      <EmptyState />
    </div>

    <div v-else class="grid grid-cols-1 gap-4">
      <GameCard
        v-for="game in games"
        :key="game.id"
        :game="game"
        @edit="$router.push(`/juegos/edicion/${game.id}`)"
        @delete="handleDelete(game)"
        @complete="handleComplete(game.id)"
        @uncomplete="handleUncomplete(game.id)"
      />
    </div>

    <BaseModal
      :show="showDeleteModal"
      title="ELIMINAR JUEGO"
      @close="showDeleteModal = false"
    >
      <p class="font-body text-retro-text text-xl mb-2">
        ¿Seguro que quieres eliminar <span class="text-retro-red font-bold">"{{ gameToDelete?.name }}"</span>?
      </p>
      <p class="font-body text-retro-mute text-lg mb-6">
        Esta acción no se puede deshacer.
      </p>
      <p v-if="actionError" class="font-body text-retro-red text-lg mb-4 text-center">
        {{ actionError }}
      </p>
      <div class="flex justify-end gap-3">
        <BaseButton variant="ghost" @click="showDeleteModal = false">
          CANCELAR
        </BaseButton>
        <BaseButton variant="danger" @click="confirmDelete">
          ELIMINAR
        </BaseButton>
      </div>
    </BaseModal>

    <BaseModal
      :show="showCompleteModal"
      title="COMPLETAR JUEGO"
      @close="showCompleteModal = false"
    >
      <div class="space-y-4">
        <p class="font-body text-retro-mute text-lg">
          ¿Has terminado este juego? Cuéntanos qué tal fue.
        </p>

        <div>
          <label class="block font-pixel text-[10px] text-retro-cyan uppercase tracking-wider mb-1">
            Valoración (1-5)
          </label>
          <div class="flex gap-2">
            <button
              v-for="star in 5"
              :key="star"
              class="font-pixel text-2xl transition-all duration-200"
              :class="star <= completeRating ? 'text-retro-yellow text-glow-yellow' : 'text-retro-mute opacity-30'"
              @click="completeRating = star"
            >
              ★
            </button>
          </div>
        </div>

        <div>
          <label class="block font-pixel text-[10px] text-retro-cyan uppercase tracking-wider mb-1">
            Notas (opcional)
          </label>
          <input
            v-model="completeNotes"
            type="text"
            placeholder="Una experiencia increíble..."
            class="input-retro"
          />
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <BaseButton variant="ghost" @click="showCompleteModal = false">
            CANCELAR
          </BaseButton>
          <BaseButton variant="success" @click="confirmComplete">
            COMPLETADO
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
