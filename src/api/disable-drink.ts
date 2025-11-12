import { api } from '@/lib/axios'

export interface DisableDrinkParams {
  drinkId: string
}

export async function disableDrink({ drinkId }: DisableDrinkParams) {
  await api.patch(`/products/drinks/${drinkId}/disable`)
}
