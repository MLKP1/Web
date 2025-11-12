import { api } from '@/lib/axios'

export interface EditDrinkParams {
  name: string
  description: string
  active: boolean
  slug: string
  price: number
  volume: number
  type: 'SODA' | 'JUICE' | 'ALCOHOLIC' | 'WATER'
  image: FileList
}

export async function editDrink(
  id: string,
  {
    name,
    description,
    active,
    slug,
    price,
    volume,
    type,
    image
  }: EditDrinkParams
) {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('description', description)
  formData.append('active', active.toString())
  formData.append('slug', slug)
  formData.append('price', price.toString())
  formData.append('volume', volume.toString())
  formData.append('type', type)

  if (image instanceof FileList && image.length > 0) {
    formData.append('image', image[0])
  }

  await api.patch(`/products/drink/${id}`, formData)
}
