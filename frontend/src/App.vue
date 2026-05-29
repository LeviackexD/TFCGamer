<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuth } from '@/composables/useAuth'

const { checkAuth } = useAuth()

onMounted(() => {
  checkAuth()
})
</script>

<template>
  <AppLayout>
    <router-view v-slot="{ Component }">
      <transition name="route" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </AppLayout>
</template>
