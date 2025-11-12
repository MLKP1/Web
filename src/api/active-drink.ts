import { api } from '@/lib/axios'

export interface ActiveDrinkParams {
  drinkId: string
}

export async function activeDrink({ drinkId }: ActiveDrinkParams) {
  await api.patch(`/products/drinks/${drinkId}/active`)
}
