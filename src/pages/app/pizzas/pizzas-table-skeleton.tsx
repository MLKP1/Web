import { Pencil, Search, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function PizzasTableSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => {
        return (
          <TableRow key={i}>
            <TableCell>
              <Button variant="outline" size="xs" disabled>
                <Search className="h-3 w-3" />
                <span className="sr-only">Detalhes da pizza</span>
              </Button>
            </TableCell>

            <TableCell className="font-mono text-xs font-medium">
              <Skeleton className="h-4 w-[160px]" />
            </TableCell>

            <TableCell className="text-muted-foreground">
              <Skeleton className="h-4 w-[120px]" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-auto" />
            </TableCell>

            <TableCell className="font-medium">
              <Skeleton className="h-4 w-[60px]" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-[60px]" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-[70px]" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-[75px]" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-[100px]" />
            </TableCell>

            <TableCell>
              <Button variant="outline" size="xs" disabled>
                <Pencil className="h-3 w-3" />
                <span className="sr-only">Editar pizza</span>
            </Button>
            </TableCell>

            <TableCell>
              <Button variant="outline" size="xs" disabled>
                <Trash className="h-3 w-3" />
                <span className="sr-only">Deletar pizza</span>
              </Button>
            </TableCell>
          </TableRow>
        )
      })}
    </>
  )
}
