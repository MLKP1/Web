import { api } from '@/lib/axios'

export interface GetPizzasQuery {
  pageIndex?: number | null
  pizzaId?: string | null
  active?: boolean | null
  name?: string | null
  description?: string | null
}

export interface GetPizzasResponse {
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
  }[]
  meta: {
    pageIndex: number
    totalCount: number
    perPage: number
  }
}

export async function getPizzas({
  pageIndex,
  pizzaId: id,
  active,
  name,
  description,
}: GetPizzasQuery) {
  const response = await api.get<GetPizzasResponse>('/products/pizzas', {
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
