import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { toast } from 'sonner'
import { registerPizza } from '@/api/register-pizza'

const createPizzaFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres' }),
  price: z.string().refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
    message: 'O preço deve ser um número positivo',
  }),
  size: z.enum(['MEDIUM', 'LARGE', 'FAMILY']),
  type: z.enum(['SALTY', 'SWEET']),
  active: z.enum(['activated', 'disabled']),
  slug: z.string().optional(),
  image: z.string().optional(),
})

type CreatePizzaFormData = z.infer<typeof createPizzaFormSchema>

interface Pizza {
  pizzaId: string
  name: string
  description: string
  active: boolean
  slug: string
  price: number
  size: 'MEDIUM' | 'LARGE' | 'FAMILY'
  type: 'SALTY' | 'SWEET'
  image: string
}

interface PizzaRegisterProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPizzaCreated?: (newPizza: Pizza) => void
}

export function PizzaRegister({ open, onOpenChange, onPizzaCreated }: PizzaRegisterProps) {
  const [previousOpenState, setPreviousOpenState] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreatePizzaFormData>({
    resolver: zodResolver(createPizzaFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      size: 'MEDIUM',
      type: 'SALTY',
      active: 'activated',
      slug: '',
      image: '',
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: CreatePizzaFormData) => {
      const response = await registerPizza({
        name: data.name,
        description: data.description,
        price: parseFloat(data.price) * 100,
        image: data.image || '',
        size: data.size,
        type: data.type,
        slug: data.slug || data.name.toLowerCase().replace(/ /g, '-'),
        active: data.active === 'activated',
      })

      const newPizza: Pizza = {
        pizzaId: response?.pizzaId || `temp-${Date.now()}`,
        name: data.name,
        description: data.description,
        price: parseFloat(data.price) * 100,
        image: data.image || '',
        size: data.size,
        type: data.type,
        slug: data.slug || data.name.toLowerCase().replace(/ /g, '-'),
        active: data.active === 'activated',
      }

    return newPizza
    },
    onSuccess: (newPizza) => {
      toast.success('Pizza cadastrada com sucesso!')
      reset()
      onOpenChange(false)

      console.log(`newPizza ${newPizza}`)

      if (onPizzaCreated) {
        onPizzaCreated(newPizza)
      }
    },
    onError: (error) => {
      toast.error('Erro ao cadastrar pizza. Tente novamente.')
      console.error(error)
    }
  })

  useEffect(() => {
    if (previousOpenState && !open) {
      reset()
    }

    setPreviousOpenState(open)
  }, [open, previousOpenState, reset])

  async function handleCreatePizza(data: CreatePizzaFormData) {
    mutation.mutate(data)
  }

  function handleSizeChange(value: string) {
    setValue('size', value as 'MEDIUM' | 'LARGE' | 'FAMILY')
  }

  function handleTypeChange(value: string) {
    setValue('type', value as 'SALTY' | 'SWEET')
  }

  function handleActiveChange(value: string) {
    setValue('active', value as 'activated' | 'disabled')
  }

  return (
    <Dialog open={open} onOpenChange={(newOpenState) => {
      if (!newOpenState) {
        reset()
      }
      onOpenChange(newOpenState)
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Nova Pizza</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleCreatePizza)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register('slug')} />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register('description')}
              className="resize-none"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                {...register('price')}
                type="number"
                step="0.01"
                min="0"
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="size">Tamanho</Label>
              <Select onValueChange={handleSizeChange} defaultValue="MEDIUM">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tamanho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="LARGE">Grande</SelectItem>
                  <SelectItem value="FAMILY">Família</SelectItem>
                </SelectContent>
              </Select>
              {errors.size && (
                <p className="text-sm text-red-500">{errors.size.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Select onValueChange={handleTypeChange} defaultValue="SALTY">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SALTY">Salgada</SelectItem>
                  <SelectItem value="SWEET">Doce</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="active">Status</Label>
              <Select onValueChange={handleActiveChange} defaultValue="activated">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activated">Ativa</SelectItem>
                  <SelectItem value="disabled">Desativada</SelectItem>
                </SelectContent>
              </Select>
              {errors.active && (
                <p className="text-sm text-red-500">{errors.active.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">URL da Imagem (opcional)</Label>
            <Input
              id="image"
              {...register('image')}
              placeholder="https://exemplo.com/imagem.jpg"
            />
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image.message}</p>
            )}
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="reset" variant="outline" onClick={() => reset()}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Salvando...' : 'Salvar Pizza'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
