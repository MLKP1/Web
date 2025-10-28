import { Pencil, Search, Trash } from 'lucide-react'
import { useState } from 'react'

import { ProductStatus } from '@/components/status'
import { DrinkType } from '@/components/drink-type'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'

import { DrinkDetails } from './drink-details'

export interface DrinkTableRowProps {
  drink: {
    drinkId: string
    active: boolean
    name: string
    description: string
    price: number
    image: string
    volume: number
    type: 'SODA' | 'JUICE' | 'ALCOHOLIC' | 'WATER'
    slug: string
  }
}

export function DrinkTableRow({ drink }: DrinkTableRowProps) {
  const [isDrinkDetailsOpen, setIsDrinkDetailsOpen] = useState(false)

  return (
    <TableRow>
      <TableCell>
        <Dialog onOpenChange={setIsDrinkDetailsOpen} open={isDrinkDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes da bebida</span>
            </Button>
          </DialogTrigger>

          <DrinkDetails open={isDrinkDetailsOpen} id={drink.drinkId} />
        </Dialog>
      </TableCell>

      <TableCell className="font-mono text-xs font-medium">
        {drink.drinkId}
      </TableCell>

      <TableCell className="font-medium">{drink.name}</TableCell>

      <TableCell>{drink.description}</TableCell>

      <TableCell>
        {drink.volume >= 1000 ?
          `${drink.volume / 1000} L` :
          `${drink.volume} ml`
        }
      </TableCell>

      <TableCell>
        <DrinkType type={drink.type} />
      </TableCell>

      <TableCell>
        <ProductStatus active={drink.active} />
      </TableCell>

      <TableCell>
        <span className="font-medium">
          {(drink.price / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </span>
      </TableCell>

      <TableCell>
        {drink.active === false ? (
          <Button
            variant="outline"
            size="xs"
            disabled={true}
            // onClick={() => activateDrinkFn({ drinkId: drink.drinkId })}
          >
            Ativar
            {/* {isActivatingDrink ? (
              <Loader2 className="ml-2 h-3 w-3 animate-spin" />
            ) : (
              <ArrowRight className="ml-2 h-3 w-3" />
            )} */}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="xs"
            disabled={true}
            // onClick={() => disableDrinkFn({ drinkId: drink.drinkId })}
          >
            Desativar
            {/* {isDisablingDrink ? (
              <Loader2 className="ml-2 h-3 w-3 animate-spin" />
            ) : (
              <ArrowRight className="ml-2 h-3 w-3" />
            )} */}
          </Button>
        )
      }
      </TableCell>

      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="xs"
              disabled={true}
            >
              <Pencil className="h-3 w-3" />
              <span className="sr-only">Editar bebida</span>
            </Button>
          </DialogTrigger>

          {/* <DrinkEdit
            onOpenChange={setIsDrinkEditOpen}
            open={isDrinkEditOpen}
            drink={drink}
            onDrinkUpdated={(updatedDrink) => editDrinkOnCache(updatedDrink)}
          /> */}
        </Dialog>
      </TableCell>

      <TableCell>
        <Button
          // onDoubleClick={() => removeDrinkFn({ drinkId: drink.drinkId })}
          disabled={true}
          variant="outline"
          size="xs"
        >
          {/* {isRemovingDrink && (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          )} */}
          <Trash className="h-3 w-3" />
          <span className="sr-only">Deletar bebida</span>
        </Button>
      </TableCell>
    </TableRow>
  )
}