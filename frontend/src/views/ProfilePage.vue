<script setup>
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import BaseButton from '@/components/ui/BaseButton.vue'

const { user, stats, statsLoading, loadStats, logout } = useAuth()
const initial = user?.value?.alias?.charAt(0)?.toUpperCase() || '?'
const agentCode = user?.value?.id ? `GB-${String(user.value.id).padStart(4, '0')}` : 'GB-????'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function stars(n) {
  if (!n) return ''
  return '★'.repeat(n) + '☆'.repeat(5 - n)
}

onMounted(loadStats)
</script>

<template>
  <div class="max-w-2xl mx-auto animate-fade-in" v-if="user">
    <div class="pixel-border bg-retro-dark overflow-hidden">

      <!-- Agent header -->
      <div class="bg-gradient-to-r from-retro-cyan/20 via-retro-cyan/5 to-transparent border-b-2 border-retro-border/50 px-5 sm:px-6 py-4">
        <div class="flex items-center gap-3">
          <span class="font-pixel text-[9px] sm:text-[10px] text-retro-cyan/60 tracking-widest">FICHA DE AGENTE</span>
          <span class="font-pixel text-[9px] text-retro-mute/40">//</span>
          <span class="font-pixel text-[9px] text-retro-yellow/60">{{ agentCode }}</span>
        </div>
      </div>

      <!-- Stats loading -->
      <div v-if="statsLoading" class="p-8 text-center">
        <p class="font-pixel text-sm text-retro-cyan animate-pulse mb-3">CARGANDO ESTADÍSTICAS...</p>
        <div class="w-48 h-2 mx-auto bg-retro-black/50 border border-retro-border">
          <div class="h-full bg-retro-cyan animate-pulse" style="width: 60%" />
        </div>
      </div>

      <!-- Stats loaded -->
      <template v-else-if="stats">
        <div class="p-5 sm:p-6 space-y-6">

          <!-- Avatar + HP/XP bars row -->
          <div class="flex items-start gap-4 sm:gap-6">
            <!-- Avatar -->
            <div class="flex-shrink-0">
              <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-retro-cyan flex items-center justify-center
                          bg-retro-black shadow-glow-cyan/30"
              >
                <span class="font-pixel text-2xl sm:text-3xl text-retro-cyan">{{ initial }}</span>
              </div>
              <p class="font-pixel text-[9px] text-retro-mute text-center mt-2">{{ stats.classTitle }}</p>
            </div>

            <!-- Bars -->
            <div class="flex-1 space-y-3 pt-1">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="font-pixel text-[9px] text-retro-green">HP</span>
                  <span class="font-pixel text-[9px] text-retro-mute">{{ stats.completedGames }}/{{ stats.totalGames }}</span>
                </div>
                <div class="h-3 bg-retro-black border border-retro-border">
                  <div
                    class="h-full bg-retro-green transition-all duration-500"
                    :style="{ width: `${stats.completionRate}%` }"
                  />
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="font-pixel text-[9px] text-retro-cyan">XP</span>
                  <span class="font-pixel text-[9px] text-retro-mute">LVL {{ stats.level }}</span>
                </div>
                <div class="h-3 bg-retro-black border border-retro-border">
                  <div
                    class="h-full bg-retro-cyan transition-all duration-500"
                    :style="{ width: `${stats.xpPercent}%` }"
                  />
                </div>
                <p class="font-pixel text-[8px] text-retro-mute mt-1">
                  {{ stats.completedGames % 3 }}/3 misiones para LVL {{ stats.level + 1 }}
                </p>
              </div>
            </div>
          </div>

          <!-- User info -->
          <div class="text-center">
            <h1 class="font-pixel text-lg sm:text-xl text-retro-text tracking-wide">{{ user.alias }}</h1>
            <p class="font-body text-base sm:text-lg text-retro-mute mt-0.5">{{ user.email }}</p>
          </div>

          <!-- Stats grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <div class="pixel-border bg-retro-black/50 p-3 text-center">
              <p class="font-pixel text-lg sm:text-xl text-retro-yellow">{{ stats.totalGames }}</p>
              <p class="font-pixel text-[9px] text-retro-mute mt-1 uppercase tracking-wider">JUEGOS</p>
            </div>
            <div class="pixel-border bg-retro-black/50 p-3 text-center">
              <p class="font-pixel text-lg sm:text-xl text-retro-green">{{ stats.completedGames }}</p>
              <p class="font-pixel text-[9px] text-retro-mute mt-1 uppercase tracking-wider">DONE</p>
            </div>
            <div class="pixel-border bg-retro-black/50 p-3 text-center">
              <p class="font-pixel text-lg sm:text-xl text-retro-cyan">{{ stats.totalHours }}h</p>
              <p class="font-pixel text-[9px] text-retro-mute mt-1 uppercase tracking-wider">HORAS</p>
            </div>
            <div class="pixel-border bg-retro-black/50 p-3 text-center">
              <p class="font-pixel text-lg sm:text-xl" :class="stats.averageRating >= 4 ? 'text-retro-yellow' : 'text-retro-mute'">
                {{ stats.averageRating || '--' }}
              </p>
              <p class="font-pixel text-[9px] text-retro-mute mt-1 uppercase tracking-wider">NOTA</p>
            </div>
          </div>

          <!-- Recent completed -->
          <div v-if="stats.recentCompleted?.length" class="pixel-border bg-retro-black/30 p-4">
            <h2 class="font-pixel text-[10px] text-retro-green uppercase tracking-wider mb-3">
              Últimas misiones completadas
            </h2>
            <div class="space-y-2">
              <div
                v-for="game in stats.recentCompleted"
                :key="game.name"
                class="flex items-center justify-between bg-retro-black/30 px-3 py-2 border border-retro-border/30"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <span class="text-retro-green text-lg flex-shrink-0">✦</span>
                  <span class="font-body text-base sm:text-lg text-retro-text truncate">{{ game.name }}</span>
                </div>
                <div class="flex items-center gap-3 flex-shrink-0">
                  <span v-if="game.rating" class="font-pixel text-xs text-retro-yellow hidden sm:inline">
                    {{ stars(game.rating) }}
                  </span>
                  <span class="font-body text-sm text-retro-mute">{{ game.hoursToBeat }}h</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="stats.totalGames > 0" class="pixel-border bg-retro-black/30 p-4 text-center">
            <p class="font-body text-base text-retro-mute">Aún no has completado ningún juego.</p>
          </div>

          <!-- Category breakdown -->
          <div v-if="stats.categoryBreakdown?.length" class="pixel-border bg-retro-black/30 p-4">
            <h2 class="font-pixel text-[10px] text-retro-cyan uppercase tracking-wider mb-3">
              Categorías
            </h2>
            <div class="space-y-2">
              <div
                v-for="cat in stats.categoryBreakdown"
                :key="cat.category"
                class="flex items-center gap-3"
              >
                <span class="font-pixel text-[9px] text-retro-mute w-24 sm:w-28 flex-shrink-0">{{ cat.category }}</span>
                <div class="flex-1 h-3 bg-retro-black border border-retro-border">
                  <div
                    class="h-full bg-retro-cyan transition-all duration-500"
                    :style="{ width: `${cat.percent}%` }"
                  />
                </div>
                <span class="font-pixel text-[9px] text-retro-mute w-8 text-right">{{ cat.percent }}%</span>
              </div>
            </div>
          </div>

        </div>
      </template>

      <!-- Stats error -->
      <div v-else class="p-8 text-center">
        <p class="font-body text-retro-mute text-lg">No se pudieron cargar las estadísticas.</p>
      </div>

      <!-- Logout button -->
      <div class="border-t-2 border-retro-border/50 px-5 sm:px-6 py-4">
        <BaseButton variant="danger" class="w-full" @click="logout">
          CERRAR SESIÓN
        </BaseButton>
      </div>

    </div>
  </div>

  <div v-else class="max-w-md mx-auto text-center py-12">
    <p class="font-pixel text-sm text-retro-cyan animate-pulse">CARGANDO...</p>
  </div>
</template>
