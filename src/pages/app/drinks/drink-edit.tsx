import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

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

import { editDrink } from '@/api/edit-drink'

const editDrinkFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres' }),
  price: z.number().min(1),
  volume: z.number().int().min(50),
  type: z.enum(['SODA', 'JUICE', 'ALCOHOLIC', 'WATER']),
  active: z.enum(['activated', 'disabled']),
  slug: z.string().min(3, { message: 'O slug deve ter pelo menos 3 caracteres' }).optional(),
  image: z.instanceof(FileList, { message: 'Deve haver uma imagem' }),
})

type EditDrinkFormData = z.infer<typeof editDrinkFormSchema>

interface Drink {
  drinkId: string
  name: string
  description: string
  active: boolean
  slug: string
  price: number
  volume: number
  type: 'SODA' | 'JUICE' | 'ALCOHOLIC' | 'WATER'
  image: string
}

interface DrinkEditProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDrinkUpdated?: (updatedDrink: Drink) => void
  drink: Drink | null
}

export function DrinkEdit({ open, onOpenChange, onDrinkUpdated, drink }: DrinkEditProps) {
  const [previousOpenState, setPreviousOpenState] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditDrinkFormData>({
    resolver: zodResolver(editDrinkFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      volume: 0,
      type: 'SODA',
      active: 'activated',
      slug: '',
      image: undefined,
    },
  })

  useEffect(() => {
    if (open && drink) {
      setValue('name', drink.name)
      setValue('description', drink.description)
      setValue('price', drink.price / 100)
      setValue('volume', drink.volume)
      setValue('type', drink.type)
      setValue('active', drink.active ? 'activated' : 'disabled')
      setValue('slug', drink.slug)
    }
  }, [open, drink, setValue])

  const mutation = useMutation({
    mutationFn: async (data: EditDrinkFormData) => {
      if (!drink) throw new Error('Bebida não encontrada')

      await editDrink(drink.drinkId, {
        name: data.name,
        description: data.description,
        price: data.price * 100,
        image: data.image,
        volume: data.volume,
        type: data.type,
        slug: data.slug || data.name.toLowerCase().replace(/ /g, '-'),
        active: data.active === 'activated',
      })

      const updatedDrink: Drink = {
        drinkId: drink.drinkId,
        name: data.name,
        description: data.description,
        price: data.price * 100,
        image: drink.image,
        volume: data.volume,
        type: data.type,
        slug: data.slug || data.name.toLowerCase().replace(/ /g, '-'),
        active: data.active === 'activated',
      }

    return updatedDrink
    },
    onSuccess: (updatedDrink) => {
      onOpenChange(false)

      if (onDrinkUpdated) {
        onDrinkUpdated(updatedDrink)
      }
    },
    onError: (error) => {
      toast.error('Erro ao atualizar bebida. Tente novamente.')
      console.error(error)
    }
  })

  useEffect(() => {
    if (previousOpenState && !open) {
      reset()
    }

    setPreviousOpenState(open)
  }, [open, previousOpenState, reset])

  async function handleUpdateDrink(data: EditDrinkFormData) {
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
          <DialogTitle>Editar bebida</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleUpdateDrink)} className="space-y-4">
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
                {...register('price', { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="volume">Volume (ml)</Label>
              <Input
                id="volume"
                {...register('volume', { valueAsNumber: true })}
                type="number"
                step="1"
                min="50"
              />
              {errors.volume && (
                <p className="text-sm text-red-500">{errors.volume.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Select onValueChange={handleTypeChange} defaultValue={drink?.type || 'SODA'}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SODA">Refrigerante</SelectItem>
                  <SelectItem value="JUICE">Suco</SelectItem>
                  <SelectItem value="ALCOHOLIC">Alcoólica</SelectItem>
                  <SelectItem value="WATER">Água</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="active">Status</Label>
              <Select 
                onValueChange={handleActiveChange}
                defaultValue={drink?.active ? 'activated' : 'disabled'}
              >
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
              <Button type="reset" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Salvando...' : 'Atualizar bebida'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
