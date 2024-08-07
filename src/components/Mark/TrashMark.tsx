import { Trash2 } from 'lucide-react';
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useControllableValue } from 'ahooks';

const variants = cva(
  {
    variants: {
    },
    defaultVariants: {
    },
  }
)

export interface TrashMarkProps extends VariantProps<typeof variants> {
  /** 当前值 null, 0, 1, 2, 3, 4, 5 */
  value?: boolean;
  /** 切换时数据变更 */
  onChange?: (value: boolean) => {};
}

export function TrashMark(props: TrashMarkProps) {
  const [state, setState] = useControllableValue<boolean | undefined>(props, {
    defaultValue: undefined,
  });


  const className = 'w-3 h-3 stroke-gray-300';
  const classNameActive = 'stroke-primary';
  const onClick = () => {
    setState(!state);
  }

  return (
    <div className="cursor-pointer" onClick={onClick}>
      <Trash2 className={cn(className, { [classNameActive]: state })} strokeWidth={2} />
    </div>
  )
}