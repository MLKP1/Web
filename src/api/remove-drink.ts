import { api } from "@/lib/axios"

export interface RemoveDrinkParams {
  drinkId: string
}

export async function removeDrink({ drinkId }: RemoveDrinkParams) {
  await api.delete(`/products/drinks/${drinkId}`)
}
