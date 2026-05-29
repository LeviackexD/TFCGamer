<script setup>
import { reactive, computed } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { getCategories } from '@/data/mockGames'

const props = defineProps({
  game: { type: Object, default: null },
})

const emit = defineEmits(['submit', 'cancel'])

const isEditing = computed(() => !!props.game)

const categories = getCategories()

const AVAILABLE_TAGS = [
  'accion', 'aventura', 'rpg', 'shooter', 'plataformas',
  'puzles', 'indie', 'mundo-abierto', 'exploracion',
  'narrativo', 'ciencia-ficcion', 'humor', 'medieval',
  'retos', 'metal', 'arte', 'terror', 'sigilo',
  'deportes', 'carreras', 'estrategia', 'simulacion',
  'supervivencia', 'multijugador', 'cooperativo',
]

const form = reactive({
  name: props.game?.name ?? '',
  category: props.game?.category ?? '',
  tags: props.game?.tags ?? '',
  metacriticScore: props.game?.metacriticScore ?? '',
  hoursToBeat: props.game?.hoursToBeat ?? '',
  notes: props.game?.notes ?? '',
  rating: props.game?.rating ?? '',
})

const errors = reactive({
  name: '',
  category: '',
  tags: '',
  metacriticScore: '',
  hoursToBeat: '',
})

const selectedTags = computed(() =>
  form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
)

function toggleTag(tag) {
  const current = selectedTags.value
  const idx = current.indexOf(tag)
  if (idx === -1) {
    form.tags = [...current, tag].join(',')
  } else {
    const next = [...current]
    next.splice(idx, 1)
    form.tags = next.join(',')
  }
}

function validate() {
  let valid = true
  Object.keys(errors).forEach(k => errors[k] = '')

  if (!form.name.trim()) {
    errors.name = 'El nombre es obligatorio'
    valid = false
  }
  if (!form.category) {
    errors.category = 'Selecciona una categoría'
    valid = false
  }
  if (!selectedTags.value.length) {
    errors.tags = 'Selecciona al menos una etiqueta'
    valid = false
  }
  const score = Number(form.metacriticScore)
  if (!form.metacriticScore || isNaN(score) || score < 0 || score > 100) {
    errors.metacriticScore = 'Valor entre 0 y 100'
    valid = false
  }
  const hours = Number(form.hoursToBeat)
  if (!form.hoursToBeat || isNaN(hours) || hours <= 0) {
    errors.hoursToBeat = 'Debe ser un número positivo'
    valid = false
  }
  return valid
}

function handleSubmit() {
  if (!validate()) return

  const data = {
    name: form.name.trim(),
    category: form.category,
    tags: form.tags,
    metacriticScore: Number(form.metacriticScore),
    hoursToBeat: Number(form.hoursToBeat),
  }

  if (form.notes.trim()) data.notes = form.notes.trim()
  if (form.rating) data.rating = Number(form.rating)

  emit('submit', data)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-5 animate-fade-in">
    <div class="pixel-border bg-retro-dark p-5 space-y-4">
      <h2 class="font-pixel text-[10px] text-retro-cyan uppercase tracking-wider">
        Información del juego
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BaseInput
          v-model="form.name"
          label="Nombre"
          placeholder="Elden Ring..."
          :error="errors.name"
        />
        <BaseSelect
          v-model="form.category"
          label="Categoría"
          :options="categories"
          placeholder="Selecciona una categoría"
        />
      </div>

      <div>
        <label class="block font-pixel text-[10px] text-retro-cyan uppercase tracking-wider mb-2">
          Etiquetas
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in AVAILABLE_TAGS"
            :key="tag"
            type="button"
            @click="toggleTag(tag)"
            class="font-pixel text-[10px] px-3 py-1.5 border transition-all duration-200 cursor-pointer"
            :class="selectedTags.includes(tag)
              ? 'bg-retro-cyan text-retro-black border-retro-cyan shadow-glow-cyan'
              : 'bg-retro-black/40 text-retro-mute border-retro-border/50 hover:border-retro-cyan/50 hover:text-retro-cyan'"
          >
            {{ tag }}
          </button>
        </div>
        <p v-if="selectedTags.length" class="font-body text-base text-retro-cyan mt-2">
          {{ form.tags }}
        </p>
        <p v-if="errors.tags" class="font-body text-sm text-retro-red mt-1">{{ errors.tags }}</p>
      </div>
    </div>

    <div class="pixel-border bg-retro-dark p-5 space-y-4">
      <h2 class="font-pixel text-[10px] text-retro-cyan uppercase tracking-wider">
        Puntuación y tiempo
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BaseInput
          v-model="form.metacriticScore"
          label="Puntuación Metacritic (0-100)"
          type="number"
          placeholder="90"
          :error="errors.metacriticScore"
        />
        <BaseInput
          v-model="form.hoursToBeat"
          label="Horas para completar"
          type="number"
          placeholder="25"
          step="0.5"
          :error="errors.hoursToBeat"
        />
      </div>
    </div>

    <div class="pixel-border bg-retro-dark p-5 space-y-4">
      <h2 class="font-pixel text-[10px] text-retro-cyan uppercase tracking-wider">
        Notas y valoración (opcional)
      </h2>

      <BaseInput
        v-model="form.notes"
        label="Notas personales"
        placeholder="Una obra maestra..."
      />

      <BaseInput
        v-model="form.rating"
        label="Valoración (1-5)"
        type="number"
        placeholder="5"
        min="1"
        max="5"
      />
    </div>

    <div class="flex items-center justify-end gap-3 pt-2">
      <BaseButton variant="ghost" @click="$emit('cancel')">
        CANCELAR
      </BaseButton>
      <BaseButton type="submit" variant="primary">
        {{ isEditing ? 'GUARDAR' : 'CREAR JUEGO' }}
      </BaseButton>
    </div>
  </form>
</template>
