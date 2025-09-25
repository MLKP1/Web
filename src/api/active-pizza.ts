import { api } from '@/lib/axios'

export interface ActivePizzaParams {
  pizzaId: string
}

export async function activePizza({ pizzaId }: ActivePizzaParams) {
  await api.patch(`/products/pizzas/${pizzaId}/active`)
}