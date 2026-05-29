<script setup>
defineProps({
  modelValue: String,
  label: String,
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Todas' },
})

defineEmits(['update:modelValue'])

function getValue(opt) {
  return typeof opt === 'object' ? opt.value : opt
}

function getLabel(opt) {
  return typeof opt === 'object' ? opt.label : opt
}
</script>

<template>
  <div class="space-y-1">
    <label v-if="label" class="block font-pixel text-[10px] text-retro-cyan uppercase tracking-wider">
      {{ label }}
    </label>
    <select
      :value="modelValue"
      class="input-retro appearance-none cursor-pointer"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">{{ placeholder }}</option>
      <option
        v-for="opt in options"
        :key="getValue(opt)"
        :value="getValue(opt)"
      >
        {{ getLabel(opt) }}
      </option>
    </select>
  </div>
</template>
