import { Badge } from '#/components/ui/badge'
import { cn } from '#/lib/utils'

interface Props {
  count: number
  onClear: () => void
  className?: string
}

export function OutOfRangeBadge({ count, onClear, className }: Props) {
  if (count === 0) return null
  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1.5 border-orange-200 bg-orange-50 font-semibold text-orange-500',
        className,
      )}
    >
      {count} out of range
      <button
        type="button"
        onClick={onClear}
        className="underline transition-colors hover:text-orange-700"
      >
        Clear
      </button>
    </Badge>
  )
}
