import { cn } from '#/lib/utils'

export function SectionTitle({
  className,
  ...props
}: React.ComponentProps<'h2'>) {
  return (
    <h2
      className={cn(
        'text-xs font-semibold tracking-wider text-muted-foreground uppercase',
        className,
      )}
      {...props}
    />
  )
}
