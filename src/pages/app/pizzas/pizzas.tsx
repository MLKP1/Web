import { useQuery } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { queryClient } from '@/lib/react-query'
import { toast } from 'sonner'
import { z } from 'zod'

import { Pagination } from '@/components/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { PizzaTableFilters } from './pizza-table-filters'
import { PizzasTableSkeleton } from './pizzas-table-skeleton'
import { PizzaTableRow } from './pizza-table-row'
import { PizzaRegister } from './pizza-register'

import { getPizzas, GetPizzasResponse } from '@/api/get-pizzas'

const activeMap: Record<string, boolean | undefined> = {
  'activated': true,
  'disabled': false,
  'all': undefined
}

export function Pizzas() {
  const [isPizzaRegisterOpen, setIsPizzaRegisterOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const pizzaId = searchParams.get('pizzaId')
  const name = searchParams.get('name')
  const description = searchParams.get('description')
  const activeParam = searchParams.get('active')

  const active = activeParam ? activeMap[activeParam] : undefined

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1')

  const {
    data: result,
    isFetching: isFetchingPizzas,
    isLoading: isLoadingPizzas,
  } = useQuery({
    queryKey: ['pizzas', pageIndex, pizzaId, active, name, description],
    queryFn: () =>
      getPizzas({
        pageIndex,
        pizzaId,
        active,
        name,
        description,
      })
  })

  function handlePaginate(pageIndex: number) {
    setSearchParams((prev) => {
      prev.set('page', (pageIndex + 1).toString())

      return prev
    })
  }

  function registerPizzaOnCache(newPizza: any) {
      const pizzasListingCache = queryClient.getQueriesData<GetPizzasResponse>({
        queryKey: ['pizzas'],
      })

      pizzasListingCache.forEach(([cacheKey, cached]) => {
        if (!cached) {
          return
        }

        queryClient.setQueryData<GetPizzasResponse>(cacheKey, {
          ...cached,
          pizzas: [newPizza, ...cached.pizzas],
        })

        toast.success('Pizza cadastrada com sucesso!')
      })
    }

  return (
    <>
      <Helmet title="Pizzas" />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
            Pizzas
            {isFetchingPizzas && (
              <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </h1>
          <Dialog onOpenChange={setIsPizzaRegisterOpen} open={isPizzaRegisterOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                size="default"
              >
                Cadastrar
              </Button>
            </DialogTrigger>

            <PizzaRegister
              open={isPizzaRegisterOpen}
              onOpenChange={setIsPizzaRegisterOpen}
              onPizzaCreated={(newPizza) => registerPizzaOnCache(newPizza)}
            />
          </Dialog>
        </div>
        <div className="space-y-2.5">
          <PizzaTableFilters />
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[140px]">Identificador</TableHead>
                  <TableHead className="w-[160px]">Nome</TableHead>
                  <TableHead className="w-[300px]">Descrição</TableHead>
                  <TableHead className="w-[100px]">Tamanho</TableHead>
                  <TableHead className="w-[100px]">Tipo</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[100px]">Preço</TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[64px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingPizzas && !result && <PizzasTableSkeleton />}

                {result &&
                  result.pizzas.map((pizza, index) => {
                    return <PizzaTableRow key={index} pizza={pizza} />
                  })}

                {result && result.pizzas.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-10 text-center text-muted-foreground"
                    >
                      Nenhum resultado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {result && (
            <Pagination
              pageIndex={pageIndex}
              totalCount={result.meta.totalCount}
              perPage={result.meta.perPage}
              onPageChange={handlePaginate}
            />
          )}
        </div>
      </div>
    </>
  )
}
