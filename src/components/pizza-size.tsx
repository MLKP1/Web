interface PizzaSizeProps {
  size: 'MEDIUM' | 'LARGE' | 'FAMILY'
}

const pizzaSizeMap: Record<string, string> = {
  MEDIUM: 'Média',
  LARGE: 'Grande',
  FAMILY: 'Família',
}

export function PizzaSize({ size }: PizzaSizeProps) {
  return (
    <span className="font-medium text-muted-foreground">
      {pizzaSizeMap[size]}
    </span>
  )
}
