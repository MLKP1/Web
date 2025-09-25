import { api } from '@/lib/axios'

export interface RegisterPizzaRequest {
  name: string
  description: string
  price: number
  image: string
  size: 'MEDIUM' | 'LARGE' | 'FAMILY'
  type: 'SALTY' | 'SWEET'
  slug: string
  active: boolean
}

export async function registerPizza({
  name,
  description,
  price,
  image,
  size,
  type,
  slug,
  active,
}: RegisterPizzaRequest) {
  const response = await api.post('/products/pizzas', {
    name,
    description,
    price,
    image,
    size,
    type,
    slug,
    active
  })

  return response.data
}
