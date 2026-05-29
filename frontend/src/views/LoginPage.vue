<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { loginSchema } from '@/lib/schemas'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const { login } = useAuth()

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
  general: '',
})

const loading = ref(false)

function validate() {
  Object.keys(errors).forEach(k => errors[k] = '')
  const result = loginSchema.safeParse(form)
  if (!result.success) {
    result.error.errors.forEach(e => {
      const field = e.path[0]
      if (field in errors) errors[field] = e.message
    })
    return false
  }
  return true
}

async function handleSubmit() {
  if (!validate()) return
  loading.value = true
  errors.general = ''
  try {
    await login({ ...form })
    router.push('/juegos')
  } catch (err) {
    if (err.status === 401) {
      errors.general = 'Email o contraseña incorrectos'
    } else if (err.errors) {
      err.errors.forEach(e => {
        if (e.field in errors) errors[e.field] = e.message
      })
    } else {
      errors.general = err.message || 'Error al iniciar sesión'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto animate-fade-in">
    <div class="pixel-border bg-retro-dark p-6 sm:p-8">
      <h1 class="font-pixel text-lg sm:text-xl text-retro-cyan text-center mb-6">
        INICIAR SESIÓN
      </h1>

      <p v-if="errors.general" class="font-body text-retro-red text-lg text-center mb-4 pixel-border border-retro-red bg-retro-red/10 p-3">
        {{ errors.general }}
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          v-model="form.email"
          label="Email"
          type="email"
          placeholder="gamer@example.com"
          :error="errors.email"
        />
        <BaseInput
          v-model="form.password"
          label="Contraseña"
          type="password"
          placeholder="Tu contraseña"
          :error="errors.password"
        />

        <BaseButton type="submit" variant="primary" class="w-full" :disabled="loading">
          {{ loading ? 'ENTRANDO...' : 'ENTRAR' }}
        </BaseButton>
      </form>

      <p class="font-body text-retro-mute text-lg text-center mt-6">
        ¿No tienes cuenta?
        <router-link to="/registro" class="text-retro-cyan hover:text-glow-cyan transition-all duration-200">
          Regístrate
        </router-link>
      </p>
    </div>
  </div>
</template>
