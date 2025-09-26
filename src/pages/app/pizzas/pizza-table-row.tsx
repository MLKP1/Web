import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, Loader2, Search, Pencil, Trash } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { activePizza } from '@/api/active-pizza'
import { disablePizza } from '@/api/disable-pizza'
import { removePizza } from '@/api/remove-pizza'
import { GetPizzasResponse } from '@/api/get-pizzas'
import { PizzaStatus } from '@/components/pizza-status'
import { PizzaType } from '@/components/pizza-type'
import { PizzaSize } from '@/components/pizza-size'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'

import { PizzaDetails } from './pizza-details'
import { PizzaEdit } from './pizza-edit'

export interface PizzaTableRowProps {
  pizza: {
    pizzaId: string
    active: boolean
    name: string
    description: string
    price: number
    image: string
    size: 'MEDIUM' | 'LARGE' | 'FAMILY'
    type: 'SWEET' | 'SALTY'
    slug: string
  }
}

export function PizzaTableRow({ pizza }: PizzaTableRowProps) {
  const [isPizzaDetailsOpen, setIsPizzaDetailsOpen] = useState(false)
  const [isPizzaEditOpen, setIsPizzaEditOpen] = useState(false)
  const queryClient = useQueryClient()

  function updatePizzaActiveOnCache(pizzaId: string, active: boolean) {
    const pizzasListingCache = queryClient.getQueriesData<GetPizzasResponse>({
      queryKey: ['pizzas'],
    })

    pizzasListingCache.forEach(([cacheKey, cached]) => {
      if (!cached) {
        return
      }

      queryClient.setQueryData<GetPizzasResponse>(cacheKey, {
        ...cached,
        pizzas: cached.pizzas.map((pizza) => {
          if (pizza.pizzaId !== pizzaId) {
            return pizza
          }

          return {
            ...pizza,
            active,
          }
        }),
      })
    })

    toast.success('Status da pizza alterado com sucesso!')
  }

  const { mutateAsync: activatePizzaFn, isPending: isActivatingPizza } =
    useMutation({
      mutationFn: activePizza,
      onSuccess: async (_, { pizzaId }) => {
        updatePizzaActiveOnCache(pizzaId, true)
      },
    })

  const { mutateAsync: disablePizzaFn, isPending: isDisablingPizza } =
    useMutation({
      mutationFn: disablePizza,
      onSuccess: async (_, { pizzaId }) => {
        updatePizzaActiveOnCache(pizzaId, false)
      },
    })

  function removePizzaOnCache(pizzaId: string) {
    const pizzasListingCache = queryClient.getQueriesData<GetPizzasResponse>({
      queryKey: ['pizzas'],
    })

    pizzasListingCache.forEach(([cacheKey, cached]) => {
      if (!cached) {
        return
      }

      queryClient.setQueryData<GetPizzasResponse>(cacheKey, {
        ...cached,
        pizzas: cached.pizzas.filter((pizza) => pizza.pizzaId !== pizzaId)
      })
    })

    toast.success('Pizza removida com sucesso!')
  }

  const { mutateAsync: removePizzaFn, isPending: isRemovingPizza } =
    useMutation({
      mutationFn: removePizza,
      onSuccess: async (_, { pizzaId }) => {
        removePizzaOnCache(pizzaId)
      }
    })

  function editPizzaOnCache(updatedPizza: PizzaTableRowProps['pizza']) {
    const pizzasListingCache = queryClient.getQueriesData<GetPizzasResponse>({
      queryKey: ['pizzas'],
    })

    pizzasListingCache.forEach(([cacheKey, cached]) => {
      if (!cached) {
        return
      }

      queryClient.setQueryData<GetPizzasResponse>(cacheKey, {
        ...cached,
        pizzas: cached.pizzas.map((pizza) => {
          if (pizza.pizzaId !== updatedPizza.pizzaId) {
            return pizza
          }

          return updatedPizza
        })
      })
    })

    toast.success('Pizza editada com sucesso!')
  }

  return (
    <TableRow>
      <TableCell>
        <Dialog onOpenChange={setIsPizzaDetailsOpen} open={isPizzaDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes da pizza</span>
            </Button>
          </DialogTrigger>

          <PizzaDetails open={isPizzaDetailsOpen} id={pizza.pizzaId} />
        </Dialog>
      </TableCell>

      <TableCell className="font-mono text-xs font-medium">
        {pizza.pizzaId}
      </TableCell>

      <TableCell className="font-medium">{pizza.name}</TableCell>

      <TableCell>{pizza.description}</TableCell>

      <TableCell>
        <PizzaSize size={pizza.size} />
      </TableCell>

      <TableCell>
        <PizzaType type={pizza.type} />
      </TableCell>

      <TableCell>
        <PizzaStatus active={pizza.active} />
      </TableCell>

      <TableCell>
        <span className="font-medium">
          {(pizza.price / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </span>
      </TableCell>

      <TableCell>
        {pizza.active === false ? (
          <Button
            variant="outline"
            size="xs"
            disabled={isActivatingPizza}
            onClick={() => activatePizzaFn({ pizzaId: pizza.pizzaId })}
          >
            Ativar
            {isActivatingPizza ? (
              <Loader2 className="ml-2 h-3 w-3 animate-spin" />
            ) : (
              <ArrowRight className="ml-2 h-3 w-3" />
            )}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="xs"
            disabled={isDisablingPizza}
            onClick={() => disablePizzaFn({ pizzaId: pizza.pizzaId })}
          >
            Desativar
            {isDisablingPizza ? (
              <Loader2 className="ml-2 h-3 w-3 animate-spin" />
            ) : (
              <ArrowRight className="ml-2 h-3 w-3" />
            )}
          </Button>
        )
      }
      </TableCell>

      <TableCell>
        <Dialog onOpenChange={setIsPizzaEditOpen} open={isPizzaEditOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="xs"
            >
              <Pencil className="h-3 w-3" />
              <span className="sr-only">Editar pizza</span>
            </Button>
          </DialogTrigger>

          <PizzaEdit
            onOpenChange={setIsPizzaEditOpen}
            open={isPizzaEditOpen}
            pizza={pizza}
            onPizzaUpdated={(updatedPizza) => editPizzaOnCache(updatedPizza)}
          />
        </Dialog>
      </TableCell>

      <TableCell>
        <Button
          onDoubleClick={() => removePizzaFn({ pizzaId: pizza.pizzaId })}
          disabled={isRemovingPizza}
          variant="outline"
          size="xs"
        >
          {isRemovingPizza && (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          )}
          <Trash className="h-3 w-3" />
          <span className="sr-only">Deletar pizza</span>
        </Button>
      </TableCell>
    </TableRow>
  )
}
