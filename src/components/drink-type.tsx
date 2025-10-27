interface DrinkTypeProps {
  type: 'SODA' | 'JUICE' | 'ALCOHOLIC' | 'WATER'
}

const drinkTypeMap: Record<string, string> = {
  SODA: 'Refrigerante',
  JUICE: 'Suco',
  ALCOHOLIC: 'Alcoólico',
  WATER: 'Água',
}

export function DrinkType({ type }: DrinkTypeProps) {
  return (
    <span className="font-medium text-muted-foreground">
      {drinkTypeMap[type]}
    </span>
  )
}
