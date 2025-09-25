import { api } from '@/lib/axios'

export interface RemovePizzaParams {
  pizzaId: string
}

export async function removePizza({ pizzaId }: RemovePizzaParams) {
  await api.delete(`/products/pizzas/${pizzaId}`)
}