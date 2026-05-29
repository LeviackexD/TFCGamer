<script setup>
import { useDebounce } from '@vueuse/core'
import { watch, ref } from 'vue'
import { getCategories } from '@/data/mockGames'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'

const props = defineProps({
  filters: { type: Object, required: true },
})

const emit = defineEmits(['update'])

const categories = getCategories()
const search = ref(props.filters.search || '')

const debouncedSearch = useDebounce(search, 300)

watch(debouncedSearch, (val) => {
  emit('update', { search: val })
})
</script>

<template>
  <div class="pixel-border bg-retro-dark p-4 sm:p-5 space-y-4">
    <h2 class="font-pixel text-[10px] text-retro-cyan uppercase tracking-wider">
      Filtrar juegos
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <BaseInput
        v-model="search"
        placeholder="Buscar por nombre..."
        type="text"
      />

      <BaseSelect
        :model-value="filters.category"
        label=""
        :options="categories"
        placeholder="Todas las categorías"
        @update:model-value="emit('update', { category: $event })"
      />

      <BaseSelect
        :model-value="filters.completed"
        label=""
        :options="[
          { value: 'true', label: 'Completado' },
          { value: 'false', label: 'Pendiente' },
        ]"
        placeholder="Todos los estados"
        @update:model-value="emit('update', { completed: $event === '' ? null : $event })"
      />

      <button
        class="btn-retro bg-retro-dark border-2 border-retro-border text-retro-mute hover:text-retro-red hover:border-retro-red"
        @click="emit('update', { search: '', category: '', tag: '', completed: null })"
      >
        LIMPIAR
      </button>
    </div>
  </div>
</template>
