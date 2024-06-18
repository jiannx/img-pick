import { Space } from "../Space";
import { Star } from 'lucide-react';
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

export interface StarMarkProps extends VariantProps<typeof variants> {
  /** 当前值 null, 0, 1, 2, 3, 4, 5 */
  value?: number;
  /** 切换时数据变更 */
  onChange?: (value: number) => {};
}

export default function StarMark(props: StarMarkProps) {
  const [state, setState] = useControllableValue<number | undefined | null>(props, {
    defaultValue: null,
  });

  const className = 'w-3 h-3 fill-gray-300';
  const classNameActive = 'fill-blue-500 stroke-blue-500';
  const onStarClick = (v: number) => {
    setState(v);
  }

  console.log('state', state, state && state <= 1)

  return (
    <Space size={0} className="cursor-pointer">
      <Star className={cn(className, { [classNameActive]: state && state >= 1 })} strokeWidth={0} onClick={() => onStarClick(1)} />
      <Star className={cn(className, { [classNameActive]: state && state >= 2 })} strokeWidth={0} onClick={() => onStarClick(2)} />
      <Star className={cn(className, { [classNameActive]: state && state >= 3 })} strokeWidth={0} onClick={() => onStarClick(3)} />
      <Star className={cn(className, { [classNameActive]: state && state >= 4 })} strokeWidth={0} onClick={() => onStarClick(4)} />
      <Star className={cn(className, { [classNameActive]: state && state >= 5 })} strokeWidth={0} onClick={() => onStarClick(5)} />
    </Space>
  )
}