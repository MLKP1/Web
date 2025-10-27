import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2 } from 'lucide-react'

import { getDrinkDetails } from '@/api/get-drinks-details'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table'

import { DrinkDetailsSkeleton } from './drink-details-skeleton'

interface DrinkDetailsProps {
  id: string
  open: boolean
}

export function DrinkDetails({ id, open }: DrinkDetailsProps) {
  const {
    data: drink,
    isLoading: isLoadingDrink,
    isFetching: isFetchingDrink,
  } = useQuery({
    queryKey: ['drink', id],
    queryFn: () => getDrinkDetails({ id }),
    staleTime: 1000 * 60 * 15, // 15 minutes
    enabled: open,
  })

  return (
    <DialogContent className="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          Drink: {id}
          {isFetchingDrink && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </DialogTitle>
        <DialogDescription>Detalhes da bebida</DialogDescription>
      </DialogHeader>

      {isLoadingDrink && <DrinkDetailsSkeleton />}

      {drink && (
        <div className="space-y-6">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-muted-foreground">Slug</TableCell>
                <TableCell className="text-right">{drink.slug}</TableCell>
              </TableRow>
              {drink.image !== undefined ? (
                <TableRow>
                  <TableCell colSpan={2}>
                    <img
                      src={drink.image}
                      alt={`Imagem da bebida ${drink.name}`}
                      width="250px"
                      height="250px"
                      className="mx-auto rounded"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell className="text-muted-foreground">Imagem</TableCell>
                  <TableCell className="text-right">Imagem não encontrada</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Criado há
                </TableCell>
                <TableCell className="text-right">
                  {formatDistanceToNow(new Date(drink.createdAt), {
                    locale: ptBR,
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Atualizado há
                </TableCell>
                <TableCell className="text-right">
                  {formatDistanceToNow(new Date(drink.updatedAt), {
                    locale: ptBR,
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </DialogContent>
  )
}