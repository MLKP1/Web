import { useQuery } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'

import { Pagination } from '@/components/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import { DrinkTableRow } from './drinks-table-row'

import { getDrinks } from '@/api/get-drinks'

export function Drinks() {
  const [searchParams, setSearchParams] = useSearchParams()

  const drinkId = searchParams.get('drinkId')
  const name = searchParams.get('name')
  const description = searchParams.get('description')
  const activeParam = searchParams.get('active')

  const active = activeParam === 'activated' ? true : activeParam === 'disabled' ? false : undefined

  const pageIndex = Number(searchParams.get('page') ?? '1') - 1

  const {
    data: result,
    isFetching: isFetchingDrinks,
    isLoading: isLoadingDrinks,
  } = useQuery({
    queryKey: ['drinks'],
    queryFn: () =>
      getDrinks({
        pageIndex,
        drinkId,
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

  return (
    <>
      <Helmet title="Bebidas" />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
            Bebidas
            {isFetchingDrinks && (
              <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </h1>
        </div>

        <div className="space-y-2.5">
            {/* <DrinkTableFilters /> */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[64px]"></TableHead>
                    <TableHead className="w-[140px]">Identificador</TableHead>
                    <TableHead className="w-[180px]">Nome</TableHead>
                    <TableHead className="w-[300px]">Descrição</TableHead>
                    <TableHead className="w-[100px]">Volume</TableHead>
                    <TableHead className="w-[100px]">Tipo</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[100px]">Preço</TableHead>
                    <TableHead className="w-[132px]"></TableHead>
                    <TableHead className="w-[64px]"></TableHead>
                    <TableHead className="w-[64px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* {isLoadingDrinks && !result && <DrinksTableSkeleton />} */}

                  {result &&
                    result.drinks.map(drink => {
                      return <DrinkTableRow key={drink.drinkId} drink={drink} />
                    })
                  }

                  {result && result.drinks.length === 0 && (
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