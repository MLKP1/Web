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
import { registerDrink } from '@/api/register-drink'

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const createDrinkFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres' }),
  price: z.string().refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
    message: 'O preço deve ser um número positivo',
  }),
  volume: z.string().refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
    message: 'O preço deve ser um número positivo',
  }),
  type: z.enum(['SODA', 'JUICE', 'ALCOHOLIC', 'WATER']),
  active: z.enum(['activated', 'disabled']),
  slug: z.string().optional(),
  image: z
    .instanceof(FileList)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
      { message: "Apenas formatos .jpg, .jpeg, .png e .webp são suportados." }
    )
    .refine(
      (files) => !files || files.length === 0 || files[0]?.size <= 25 * 1024 * 1024,
      { message: "A imagem deve ter no máximo 25MB." }
    )
})

type CreateDrinkFormData = z.infer<typeof createDrinkFormSchema>

interface Drink {
  drinkId: string
  name: string
  description: string
  active: boolean
  slug: string
  price: number
  volume: number
  type: 'SODA' | 'JUICE' | 'ALCOHOLIC' | 'WATER'
  image: FileList
}

interface DrinkRegisterProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDrinkCreated?: (newDrink: Drink) => void
}

export function DrinkRegister({ open, onOpenChange, onDrinkCreated }: DrinkRegisterProps) {
  const [previousOpenState, setPreviousOpenState] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateDrinkFormData>({
    resolver: zodResolver(createDrinkFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      volume: undefined,
      type: 'SODA',
      active: 'activated',
      slug: '',
      image: undefined,
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: CreateDrinkFormData) => {
      const response = await registerDrink({
        name: data.name,
        description: data.description,
        price: parseFloat(data.price) * 100,
        image: data.image,
        volume: parseInt(data.volume),
        type: data.type,
        slug: data.slug || data.name.toLowerCase().replace(/ /g, '-'),
        active: data.active === 'activated',
      })

      const newDrink: Drink = {
        drinkId: response.drinkId,
        name: data.name,
        description: data.description,
        price: parseFloat(data.price) * 100,
        image: data.image,
        volume: parseInt(data.volume),
        type: data.type,
        slug: data.slug || data.name.toLowerCase().replace(/ /g, '-'),
        active: data.active === 'activated',
      }

    return newDrink
    },
    onSuccess: (newDrink) => {
      reset()
      onOpenChange(false)

      if (onDrinkCreated) {
        onDrinkCreated(newDrink)
      }
    },
    onError: (error) => {
      toast.error('Erro ao cadastrar bebida. Tente novamente.')
      console.error(error)
    }
  })

  useEffect(() => {
    if (previousOpenState && !open) {
      reset()
    }

    setPreviousOpenState(open)
  }, [open, previousOpenState, reset])

  async function handleCreateDrink(data: CreateDrinkFormData) {
    mutation.mutate(data)
  }

  function handleTypeChange(value: string) {
    setValue('type', value as 'SODA' | 'JUICE' | 'ALCOHOLIC' | 'WATER')
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
          <DialogTitle>Cadastrar Nova Bebida</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleCreateDrink)} className="space-y-4">
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
              <Label htmlFor="volume">Volume</Label>
              <Input
                id="volume"
                {...register('volume')}
                type="number"
                min="100"
              />
              {errors.volume && (
                <p className="text-sm text-red-500">{errors.volume.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Select onValueChange={handleTypeChange} defaultValue="SODA">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SODA">Refrigerante</SelectItem>
                  <SelectItem value="JUICE">Suco</SelectItem>
                  <SelectItem value="ALCOHOLIC">Alcólico</SelectItem>
                  <SelectItem value="WATER">Água</SelectItem>
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
            <Label htmlFor="image">Imagem</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              {...register('image')}
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
              {mutation.isPending ? 'Salvando...' : 'Salvar Bebida'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
