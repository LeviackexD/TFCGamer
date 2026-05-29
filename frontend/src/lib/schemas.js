import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  alias: z.string().min(2, 'El alias debe tener al menos 2 caracteres').max(30, 'El alias no puede exceder 30 caracteres'),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

export const createGameSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  category: z.string().min(1, 'La categoría es obligatoria'),
  tags: z.string().min(1, 'Añade al menos una etiqueta'),
  metacriticScore: z.coerce.number().int().min(0, 'Mínimo 0').max(100, 'Máximo 100'),
  hoursToBeat: z.coerce.number().positive('Debe ser un número positivo'),
  notes: z.string().optional(),
  rating: z.coerce.number().int().min(1, 'Valoración mínima 1').max(5, 'Valoración máxima 5').optional(),
})

export const updateGameSchema = createGameSchema.partial()

export const completeGameSchema = z.object({
  notes: z.string().optional(),
  rating: z.coerce.number().int().min(1, 'Valoración mínima 1').max(5, 'Valoración máxima 5').optional(),
})
