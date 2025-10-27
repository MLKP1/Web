import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table'

export function DrinkDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="text-muted-foreground">Slug</TableCell>
            <TableCell className="flex justify-end">
              <Skeleton className="ml-auto h-5 w-24" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              <Skeleton className="mx-auto h-[250px] w-[250px]" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-muted-foreground">Criado há</TableCell>
            <TableCell className="text-right">
              <Skeleton className="ml-auto h-5 w-[148px]" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-muted-foreground">Atualizado há</TableCell>
            <TableCell className="text-right">
              <Skeleton className="ml-auto h-5 w-[148px]" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
