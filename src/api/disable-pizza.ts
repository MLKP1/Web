import { api } from '@/lib/axios'

export interface DisablePizzaParams {
  pizzaId: string
}

export async function disablePizza({ pizzaId }: DisablePizzaParams) {
  await api.patch(`/products/pizzas/${pizzaId}/disable`)
}