import { api } from '@/lib/axios'

export type GetPopularProductsResponse = Array<{
  product: string
  amount: number
}>

export async function getPopularProducts() {
  const response = await api.get<GetPopularProductsResponse>(
    '/metrics/popular-products',
    {
      withCredentials: true,
    }
  )

  return response.data
}
