<script setup>
import { onMounted, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { user, isAuthenticated, logout } = useAuth()
const poweredOn = ref(false)
const menuOpen = ref(false)

onMounted(() => {
  setTimeout(() => { poweredOn.value = true }, 100)
})

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <div class="crt-screen min-h-screen flex flex-col">
    <div class="crt-flicker flex flex-col flex-1">
      <div :class="['flex flex-col flex-1 bg-retro-black relative', { 'crt-power-on': !poweredOn }]">
        <!-- Vignette edges -->
        <div class="fixed inset-0 pointer-events-none z-40"
          style="background: radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.7) 100%)"
        />

        <!-- Header -->
        <header class="flex-shrink-0 relative z-30 border-b-2 border-retro-border bg-retro-dark/90 backdrop-blur-sm">
          <div class="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
            <router-link to="/" class="flex items-center gap-2 sm:gap-3 group" @click="closeMenu">
              <div class="flex items-center gap-1 font-pixel text-sm sm:text-base">
                <span class="text-retro-cyan text-glow-cyan group-hover:animate-pixelBounce transition-all duration-300">&lt;</span>
                 <span class="text-retro-yellow relative">
                   GB
                   <span class="absolute -inset-1 bg-retro-cyan/5 blur-sm" />
                 </span>
                <span class="text-retro-cyan text-glow-cyan group-hover:animate-pixelBounce transition-all duration-300" style="animation-delay: 0.1s">/&gt;</span>
              </div>
              <span class="font-pixel text-[10px] sm:text-xs text-retro-mute hidden sm:inline tracking-[0.2em]">
                BACKLOG
              </span>
            </router-link>

            <!-- Desktop nav -->
            <nav class="hidden sm:flex items-center gap-3 sm:gap-5">
              <template v-if="isAuthenticated">
                <router-link
                  to="/juegos"
                  class="font-pixel text-[10px] sm:text-xs text-retro-mute hover:text-retro-cyan transition-all duration-200 relative group/nav"
                >
                  JUEGOS
                  <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-retro-cyan transition-all duration-200 group-hover/nav:w-full" />
                </router-link>

                <router-link
                  to="/juegos/nuevo"
                  class="font-pixel text-[10px] sm:text-xs bg-retro-red text-retro-black px-3 py-2 sm:px-4 sm:py-2.5
                         hover:shadow-glow-red transition-all duration-200 relative overflow-hidden group"
                >
                  <span class="relative z-10">+ NUEVO</span>
                  <span class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
                </router-link>

                <router-link
                  to="/perfil"
                  class="font-pixel text-[9px] sm:text-[10px] text-retro-cyan hover:text-glow-cyan transition-all duration-200"
                  :title="user?.alias"
                >
                  {{ user?.alias?.toUpperCase() }}
                </router-link>

                <button
                  class="font-pixel text-[9px] sm:text-[10px] text-retro-mute hover:text-retro-red transition-all duration-200"
                  @click="logout"
                >
                  SALIR
                </button>
              </template>

              <template v-else>
                <router-link
                  to="/login"
                  class="font-pixel text-[10px] sm:text-xs text-retro-mute hover:text-retro-cyan transition-all duration-200 relative group/nav"
                >
                  ENTRAR
                  <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-retro-cyan transition-all duration-200 group-hover/nav:w-full" />
                </router-link>

                <router-link
                  to="/registro"
                  class="font-pixel text-[10px] sm:text-xs bg-retro-cyan text-retro-black px-3 py-2 sm:px-4 sm:py-2.5
                         hover:shadow-glow-cyan transition-all duration-200"
                >
                  REGISTRO
                </router-link>
              </template>
            </nav>

            <!-- Hamburger button (mobile) -->
            <button
              class="sm:hidden p-3 text-retro-mute hover:text-retro-cyan transition-colors duration-200"
              @click="toggleMenu"
              aria-label="Menú de navegación"
              :aria-expanded="menuOpen"
            >
              <div class="w-5 h-4 relative flex flex-col justify-between">
                <span class="block h-0.5 bg-current rounded transition-all duration-200"
                  :class="{ 'rotate-45 translate-y-[7px]': menuOpen }" />
                <span class="block h-0.5 bg-current rounded transition-all duration-200"
                  :class="{ 'opacity-0': menuOpen }" />
                <span class="block h-0.5 bg-current rounded transition-all duration-200"
                  :class="{ '-rotate-45 -translate-y-[7px]': menuOpen }" />
              </div>
            </button>
          </div>

          <!-- Mobile dropdown menu -->
          <transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-4"
          >
            <div
              v-if="menuOpen"
              class="sm:hidden border-t-2 border-retro-border bg-retro-dark/95 backdrop-blur-sm"
            >
              <div class="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-2">
                <template v-if="isAuthenticated">
                  <router-link
                    to="/juegos"
                    class="font-pixel text-[10px] text-retro-mute hover:text-retro-cyan transition-all duration-200 px-3 py-3 border border-retro-border/50 hover:border-retro-cyan/50"
                    @click="closeMenu"
                  >
                    MIS JUEGOS
                  </router-link>
                  <router-link
                    to="/juegos/nuevo"
                    class="font-pixel text-[10px] text-retro-black bg-retro-red px-3 py-3 border border-retro-red/50 text-center
                           hover:shadow-glow-red transition-all duration-200"
                    @click="closeMenu"
                  >
                    + NUEVO JUEGO
                  </router-link>
                  <router-link
                    to="/perfil"
                    class="font-pixel text-[10px] text-retro-cyan hover:text-glow-cyan transition-all duration-200 px-3 py-3 border border-retro-border/50 hover:border-retro-cyan/50"
                    @click="closeMenu"
                  >
                    {{ user?.alias?.toUpperCase() || 'PERFIL' }}
                  </router-link>
                  <button
                    class="font-pixel text-[10px] text-retro-mute hover:text-retro-red transition-all duration-200 px-3 py-3 border border-retro-border/50 hover:border-retro-red/50 text-left"
                    @click="logout"
                  >
                    CERRAR SESIÓN
                  </button>
                </template>

                <template v-else>
                  <router-link
                    to="/login"
                    class="font-pixel text-[10px] text-retro-mute hover:text-retro-cyan transition-all duration-200 px-3 py-3 border border-retro-border/50 hover:border-retro-cyan/50"
                    @click="closeMenu"
                  >
                    ENTRAR
                  </router-link>
                  <router-link
                    to="/registro"
                    class="font-pixel text-[10px] text-retro-black bg-retro-cyan px-3 py-3 border border-retro-cyan/50 text-center
                           hover:shadow-glow-cyan transition-all duration-200"
                    @click="closeMenu"
                  >
                    REGISTRO
                  </router-link>
                </template>
              </div>
            </div>
          </transition>
        </header>

        <!-- Main content -->
        <main class="flex-1 relative z-20 max-w-6xl mx-auto w-full px-4 py-6 sm:py-8">
          <slot />
        </main>

        <!-- Footer -->
        <footer class="flex-shrink-0 relative z-30 border-t-2 border-retro-border bg-retro-dark/70">
          <div class="max-w-6xl mx-auto px-4 py-4 sm:py-5">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p class="font-body text-base sm:text-lg text-retro-mute">
                &copy; 2026 <span class="text-retro-cyan">Gamer Backlog</span>
              </p>
              <p class="font-body text-base sm:text-lg text-retro-mute text-center">
                <span class="text-retro-yellow">✦</span>
                "Porque ya va siendo hora de terminar algo en tu vida gamer."
                <span class="text-retro-yellow">✦</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>
