<script setup>
</script>

<template>
  <div class="animate-fade-in">
    <!-- Hero Section -->
    <section class="relative py-8 sm:py-16 overflow-hidden">
      <!-- Pixel art decoration lines -->
      <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-retro-cyan to-transparent opacity-30" />
      <div class="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-retro-cyan to-transparent opacity-30" />

      <div class="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
        <!-- Pixel Character -->
        <div class="pixel-character shrink-0">
          <div class="relative w-32 h-32 sm:w-40 sm:h-40 bg-retro-dark border-2 border-retro-border p-3">
            <!-- Pixel art character built with CSS blocks -->
            <div class="grid grid-cols-8 gap-[2px] w-full h-full">
              <!-- Row 1: hair -->
              <div v-for="i in 8" :key="'r1-'+i"
                class="aspect-square"
                :class="[i >= 3 && i <= 6 ? 'bg-retro-cyan/70' : '']"
              />
              <!-- Row 2: face / eyes -->
              <div v-for="i in 8" :key="'r2-'+i"
                class="aspect-square"
                :class="{
                  'bg-retro-yellow': i >= 3 && i <= 6,
                  'bg-retro-black pixel-eye': i === 3 || i === 6,
                }"
              />
              <!-- Row 3: face / mouth -->
              <div v-for="i in 8" :key="'r3-'+i"
                class="aspect-square"
                :class="{
                  'bg-retro-yellow': i >= 2 && i <= 7,
                  'bg-retro-red': i === 4 || i === 5,
                }"
              />
              <!-- Row 4: neck -->
              <div v-for="i in 8" :key="'r4-'+i"
                class="aspect-square"
                :class="[i >= 4 && i <= 5 ? 'bg-retro-yellow' : '']"
              />
              <!-- Row 5: body -->
              <div v-for="i in 8" :key="'r5-'+i"
                class="aspect-square"
                :class="{
                  'bg-retro-cyan': i >= 2 && i <= 7,
                  'bg-retro-yellow': i === 3 || i === 6,
                }"
              />
              <!-- Row 6-7: body -->
              <template v-for="row in [6,7]" :key="'r'+row">
                <div v-for="i in 8" :key="'r'+row+'-'+i"
                  class="aspect-square"
                  :class="[i >= 2 && i <= 7 ? 'bg-retro-cyan' : '']"
                />
              </template>
            </div>
          </div>
        </div>

        <div class="text-center lg:text-left max-w-xl">
          <div class="font-pixel text-3xl sm:text-5xl text-retro-cyan mb-4 text-glow-cyan tracking-wider">
            &lt;GB/&gt;
          </div>

          <h1 class="font-pixel text-lg sm:text-2xl text-retro-text mt-4 leading-relaxed">
            GAMER<br class="sm:hidden" />
            <span class="text-retro-yellow">BACKLOG</span>
          </h1>

          <p class="font-body text-xl sm:text-2xl text-retro-mute mt-4">
            Porque ya va siendo hora de terminar algo en tu vida gamer.
          </p>

          <div class="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <router-link
              to="/juegos"
              class="btn-retro bg-retro-cyan text-retro-black hover:shadow-glow-cyan border-b-4 border-cyan-700 w-full sm:w-auto text-center"
            >
              VER MIS JUEGOS
            </router-link>
            <router-link
              to="/juegos/nuevo"
              class="btn-retro bg-transparent border-2 border-retro-cyan text-retro-cyan
                     hover:bg-retro-cyan/10 border-b-4 w-full sm:w-auto text-center"
            >
              + AÑADIR JUEGO
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Divider pixel art -->
    <div class="pixel-divider" />

    <!-- Steps Section -->
    <section class="py-8 sm:py-12">
      <h2 class="font-pixel text-xs sm:text-sm text-retro-cyan text-center mb-8 sm:mb-12 uppercase tracking-widest">
        Cómo funciona
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div class="pixel-border-retro bg-retro-dark p-5 sm:p-6 text-center group hover:-translate-y-1 transition-transform duration-200">
          <div class="font-pixel text-3xl sm:text-4xl text-retro-yellow mb-3 text-glow-yellow">01</div>
          <div class="w-10 h-0.5 bg-retro-yellow mx-auto mb-4 opacity-40" />
          <h3 class="font-pixel text-xs text-retro-text mb-2">AÑADE</h3>
          <p class="font-body text-lg sm:text-xl text-retro-mute">
            Registra tus juegos pendientes con su puntuación y horas estimadas.
          </p>
        </div>

        <div class="pixel-border-retro bg-retro-dark p-5 sm:p-6 text-center group hover:-translate-y-1 transition-transform duration-200">
          <div class="font-pixel text-3xl sm:text-4xl text-retro-cyan mb-3 text-glow-cyan">02</div>
          <div class="w-10 h-0.5 bg-retro-cyan mx-auto mb-4 opacity-40" />
          <h3 class="font-pixel text-xs text-retro-text mb-2">PRIORIZA</h3>
          <p class="font-body text-lg sm:text-xl text-retro-mute">
            Nuestro algoritmo calcula qué jugar primero: más calidad en menos tiempo.
          </p>
        </div>

        <div class="pixel-border-retro bg-retro-dark p-5 sm:p-6 text-center group hover:-translate-y-1 transition-transform duration-200">
          <div class="font-pixel text-3xl sm:text-4xl text-retro-green mb-3 text-glow-green">03</div>
          <div class="w-10 h-0.5 bg-retro-green mx-auto mb-4 opacity-40" />
          <h3 class="font-pixel text-xs text-retro-text mb-2">COMPLETA</h3>
          <p class="font-body text-lg sm:text-xl text-retro-mute">
            Marca como completado, valora y deja constancia de tus experiencias.
          </p>
        </div>
      </div>
    </section>

    <!-- Quote Section -->
    <section class="py-8 sm:py-12">
      <div class="pixel-border-accent bg-retro-dark/50 p-6 sm:p-8 max-w-2xl mx-auto text-center">
        <p class="font-pixel text-xs sm:text-sm text-retro-cyan leading-relaxed">
          "Para los que no empiezan algo sin terminarlo."
        </p>
        <div class="w-12 h-0.5 bg-retro-cyan mx-auto my-4 opacity-30" />
        <p class="font-body text-retro-mute text-lg sm:text-xl">
          — Gamer Backlog, 2026
        </p>
      </div>
    </section>
  </div>
</template>
