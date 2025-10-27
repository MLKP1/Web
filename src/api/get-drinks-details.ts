import { api } from '@/lib/axios'

export interface GetDrinkDetailsParams {
  id: string
}

export interface GetDrinkDetailsResponse {
  drinks: {
    drinkId: string
    active: boolean
    name: string,
    description: string,
    price: number,
    image: string,
    volume: number,
    type: 'SODA' | 'JUICE' | 'ALCOHOLIC' | 'WATER',
    slug: string,
    createdAt: string
    updatedAt: string
  }[]
}

export async function getDrinkDetails({ id }: GetDrinkDetailsParams) {
  const response = await api.get<GetDrinkDetailsResponse>(`/products/drinks?id=${id}`)
  return response.data.drinks[0]
}