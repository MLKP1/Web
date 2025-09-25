import { api } from '@/lib/axios'

export interface EditPizzaParams {
  name: string
  description: string
  active: boolean
  slug: string
  price: number
  type: 'SALTY' | 'SWEET'
  size: 'MEDIUM' | 'LARGE' | 'FAMILY'
  image?: string
}

export async function editPizza(
  id: string,
  {
    name,
    description,
    active,
    slug,
    price,
    type,
    size,
    image
  }: EditPizzaParams
) {
  await api.put(`/products/pizza/${id}`, {
    name,
    description,
    active,
    slug,
    price,
    type,
    size,
    image
  })
}
