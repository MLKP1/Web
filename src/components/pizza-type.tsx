interface PizzaTypeProps {
  type: 'SALTY' | 'SWEET'
}

const pizzaTypeMap: Record<string, string> = {
  SALTY: 'Salgada',
  SWEET: 'Doce',
}

export function PizzaType({ type }: PizzaTypeProps) {
  return (
    <span className="font-medium text-muted-foreground">
      {pizzaTypeMap[type]}
    </span>
  )
}
