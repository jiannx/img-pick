import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const spaceVariants = cva(
  "flex items-center",
  {
    variants: {
      direction: {
        row: "flex-row",
        col: "flex-col",
      },
      size: {
        md: "gap-2",
        sm: "gap-1",
        lg: "gap-4",
      },
    },
    defaultVariants: {
      direction: "row",
      size: "md",
    },
  }
)
export interface SpaceProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof spaceVariants> { }

export function Space({
  direction,
  size,
  className,
  children,
  style,
}: SpaceProps) {
  return (
    <div className={cn(spaceVariants({ direction, size, className }))} style={style}>
      {children}
    </div>
  )
}