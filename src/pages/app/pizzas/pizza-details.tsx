import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2 } from 'lucide-react'

import { getPizzaDetails } from '@/api/get-pizza-details'
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

import { PizzaDetailsSkeleton } from './pizza-details-skeleton'

interface PizzaDetailsProps {
  id: string
  open: boolean
}

export function PizzaDetails({ id, open }: PizzaDetailsProps) {
  const {
    data: pizza,
    isLoading: isLoadingPizza,
    isFetching: isFetchingPizza,
  } = useQuery({
    queryKey: ['pizza', id],
    queryFn: () => getPizzaDetails({ id }),
    staleTime: 1000 * 60 * 15, // 15 minutes
    enabled: open,
  })

  return (
    <DialogContent className="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          Pizza: {id}
          {isFetchingPizza && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </DialogTitle>
        <DialogDescription>Detalhes da pizza</DialogDescription>
      </DialogHeader>

      {isLoadingPizza && <PizzaDetailsSkeleton />}

      {pizza && (
        <div className="space-y-6">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-muted-foreground">Slug</TableCell>
                <TableCell className="text-right">{pizza.slug}</TableCell>
              </TableRow>
              {pizza.image !== undefined ? (
                <TableRow>
                  <TableCell colSpan={2}>
                    <img
                      src={pizza.image}
                      alt={`Pizza de ${pizza.name.toLowerCase()}`}
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
                  {formatDistanceToNow(new Date(pizza.createdAt), {
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
                  {formatDistanceToNow(new Date(pizza.updatedAt), {
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
