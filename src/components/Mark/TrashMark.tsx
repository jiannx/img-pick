import { Space } from "../Space";
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
  value?: number;
  /** 切换时数据变更 */
  onChange?: (value: number) => {};
}

export function TrashMark(props: TrashMarkProps) {
  const [state, setState] = useControllableValue<number | undefined | null>(props, {
    defaultValue: null,
  });

  const className = 'w-3 h-3 fill-gray-300';
  const classNameActive = 'fill-blue-500 stroke-blue-500';
  const onStarClick = (v: number) => {
    setState(v);
  }
  
  return (
    <Space size={0} className="cursor-pointer">
      <Trash2 className={className} strokeWidth={1}/>
    </Space>
  )
}