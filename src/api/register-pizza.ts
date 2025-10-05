import { api } from '@/lib/axios'

export interface RegisterPizzaRequest {
  name: string
  description: string
  price: number
  image: FileList
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
  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);
  formData.append('price', price.toString());
  formData.append('size', size);
  formData.append('type', type);
  formData.append('slug', slug);
  formData.append('active', active.toString());

  if (image instanceof FileList && image.length > 0) {
    formData.append('image', image[0]);
  } else if (typeof image === 'string') {
    formData.append('image', image);
  }

  const response = await api.post('/products/pizzas', formData);

  return response.data
}
