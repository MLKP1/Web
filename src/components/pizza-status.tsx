interface PizzaStatusProps {
  active: boolean
}

const pizzaStatusMap: Record<string, string> = {
  true: 'Ativa',
  false: 'Inativa',
}

export function PizzaStatus({ active }: PizzaStatusProps) {
  return (
    <div className="flex items-center gap-2">
      {active ? (
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
      ) : (
        <span className="h-2 w-2 rounded-full bg-rose-500" />
      )}

      <span className="font-medium text-muted-foreground">
        {pizzaStatusMap[active.toString()]}
      </span>
    </div>
  )
}
