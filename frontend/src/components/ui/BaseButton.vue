<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: v => ['primary', 'danger', 'ghost', 'success'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: v => ['sm', 'md', 'lg'].includes(v),
  },
})

const variantClasses = {
  primary: 'bg-retro-cyan text-retro-black hover:shadow-glow-cyan border-b-4 border-cyan-700',
  danger: 'bg-retro-red text-retro-black hover:shadow-glow-red border-b-4 border-red-700',
  ghost: 'bg-transparent text-retro-cyan border-2 border-retro-cyan hover:bg-retro-cyan/10 border-b-4',
  success: 'bg-retro-green text-retro-black border-b-4 border-green-700',
}

const sizeClasses = {
  sm: 'px-4 py-2 text-[10px]',
  md: 'px-6 py-3 text-xs',
  lg: 'px-8 py-4 text-sm',
}
</script>

<template>
  <button
    class="btn-retro inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed
           disabled:hover:shadow-none disabled:translate-y-0 disabled:border-b-4"
    :class="[variantClasses[variant], sizeClasses[size]]"
  >
    <slot />
  </button>
</template>
