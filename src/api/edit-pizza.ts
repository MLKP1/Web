import { api } from '@/lib/axios'

export interface EditPizzaParams {
  name: string
  description: string
  active: boolean
  slug: string
  price: number
  type: 'SALTY' | 'SWEET'
  size: 'MEDIUM' | 'LARGE' | 'FAMILY'
  image: FileList
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
  const formData = new FormData()
  formData.append('name', name)
  formData.append('description', description)
  formData.append('active', active.toString())
  formData.append('slug', slug)
  formData.append('price', price.toString())
  formData.append('type', type)
  formData.append('size', size)

  if (image instanceof FileList && image.length > 0) {
    formData.append('image', image[0])
  }

  await api.patch(`/products/pizza/${id}`, formData)
}
