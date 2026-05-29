<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  error: String,
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="space-y-1">
    <label v-if="label" class="block font-pixel text-[10px] text-retro-cyan uppercase tracking-wider">
      {{ label }}
    </label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      class="input-retro"
      :class="{ 'border-retro-red shadow-glow-red': error }"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p v-if="error" class="font-body text-retro-red text-lg">{{ error }}</p>
  </div>
</template>
