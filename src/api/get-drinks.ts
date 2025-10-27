import { api } from '@/lib/axios'

export interface GetDrinksQuery {
  pageIndex?: number | null
  drinkId?: string | null
  active?: boolean | null
  name?: string | null
  description?: string | null
}

export interface GetDrinksResponse {
  drinks: {
    drinkId: string
    active: boolean
    name: string
    description: string
    price: number
    image: string
    volume: number
    type: 'SODA' | 'JUICE' | 'ALCOHOLIC' | 'WATER'
    slug: string
  }[]
  meta: {
    pageIndex: number
    totalCount: number
    perPage: number
  }
}

export async function getDrinks({
  pageIndex,
  drinkId: id,
  active,
  name,
  description,
}: GetDrinksQuery) {
  const response = await api.get<GetDrinksResponse>('/products/drinks', {
    params: {
      pageIndex,
      id,
      active,
      name,
      description,
    }
  })

  return response.data
}