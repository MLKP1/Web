import { Search, X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const pizzasFiltersSchema = z.object({
  pizzaId: z.string().optional(),
  active: z.enum(['activated', 'disabled', 'all']).optional(),
  name: z.string().optional(),
  description: z.string().optional(),
})

type PizzaFiltersSchema = z.infer<typeof pizzasFiltersSchema>

export function PizzaTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const pizzaId = searchParams.get('pizzaId')
  const active = searchParams.get('active')
  const name = searchParams.get('name')
  const description = searchParams.get('description')

  const { register, handleSubmit, reset, control } =
    useForm<PizzaFiltersSchema>({
      defaultValues: {
        pizzaId: pizzaId ?? '',
        active: (active === 'activated' || active === 'disabled') ? active : 'all',
        name: name ?? '',
        description: description ?? '',
      },
    })

  function handleFilter(data: PizzaFiltersSchema) {
    const pizzaId = data.pizzaId?.toString()
    const active = data.active?.toString()
    const name = data.name?.toString()
    const description = data.description?.toString()

    setSearchParams((prev) => {
      if (pizzaId) {
        prev.set('pizzaId', pizzaId)
      } else {
        prev.delete('pizzaId')
      }

      if (active) {
        prev.set('active', active)
      } else {
        prev.delete('active')
      }

      if (name) {
        prev.set('name', name)
      } else {
        prev.delete('name')
      }

      if (description) {
        prev.set('description', description)
      } else {
        prev.delete('description')
      }

      prev.set('page', '1')

      return prev
    })
  }

  function handleClearFilters() {
    setSearchParams((prev) => {
      prev.delete('pizzaId')
      prev.delete('active')
      prev.delete('name')
      prev.delete('description')
      prev.set('page', '1')

      return prev
    })

    reset({
      pizzaId: '',
      active: 'all',
      name: '',
      description: '',
    })
  }

  const hasAnyFilter = !!pizzaId || !!name || !!description || (!!active && active !== 'all')

  return (
    <div className="flex items-center justify-between">
      <form
        onSubmit={handleSubmit(handleFilter)}
        className="flex items-center gap-2"
      >
        <span className="text-sm font-semibold">Filtros:</span>
        <Input
          placeholder="ID da pizza"
          className="h-8 w-[200px]"
          {...register('pizzaId')}
        />
        <Input
          placeholder="Nome da pizza"
          className="h-8 w-auto"
          {...register('name')}
        />
        <Input
          placeholder="Descrição"
          className="h-8 w-auto min-w-56"
          {...register('description')}
        />
        <Controller
          control={control}
          name="active"
          render={({ field: { name, onChange, value, disabled } }) => {
            return (
              <Select
                name={name}
                onValueChange={onChange}
                value={value}
                disabled={disabled}
              >
                <SelectTrigger className="h-8 w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="activated">Ativas</SelectItem>
                  <SelectItem value="disabled">Desativas</SelectItem>
                </SelectContent>
              </Select>
            )
          }}
        />

        <Button type="submit" variant="secondary" size="xs">
          <Search className="mr-2 h-4 w-4" />
          Filtrar resultados
        </Button>

        <Button
          type="button"
          variant="outline"
          size="xs"
          disabled={!hasAnyFilter}
          onClick={handleClearFilters}
        >
          <X className="mr-2 h-4 w-4" />
          Remover filtros
        </Button>
      </form>
    </div>
  )
}
