import { api } from '@/lib/axios'

export interface GetPizzaDetailsParams {
  id: string
}

export interface GetPizzaDetailsResponse {
  pizzas: {
    pizzaId: string
    active: boolean
    name: string
    description: string
    price: number
    image: string
    size: 'MEDIUM' | 'LARGE' | 'FAMILY'
    type: 'SWEET' | 'SALTY'
    slug: string
    createdAt: string
    updatedAt: string
  }[]
}

export async function getPizzaDetails({ id }: GetPizzaDetailsParams) {
  const response = await api.get<GetPizzaDetailsResponse>(`/products/pizzas?id=${id}`)

  return response.data.pizzas[0]
}
