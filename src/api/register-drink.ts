import { api } from '@/lib/axios'

export interface RegisterDrinkRequest {
  name: string
  description: string
  price: number
  image: FileList
  volume: number
  type: 'SODA' | 'JUICE' | 'ALCOHOLIC' | 'WATER'
  slug: string
  active: boolean
}

export async function registerDrink({
  name,
  description,
  price,
  image,
  volume,
  type,
  slug,
  active,
}: RegisterDrinkRequest) {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('description', description)
  formData.append('price', price.toString())
  formData.append('volume', volume.toString())
  formData.append('type', type)
  formData.append('slug', slug)
  formData.append('active', active.toString())

  if (image instanceof FileList && image.length > 0) {
    formData.append('image', image[0])
  } else if (typeof image === 'string') {
    formData.append('image', image)
  }

  const response = await api.post('/products/drinks', formData)

  return response.data
}