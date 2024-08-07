import { Space } from "../Space";
import { Circle } from 'lucide-react';
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

const colors = ['fill-red-400', 'fill-blue-400', 'fill-green-400', 'fill-yellow-400'];

export interface ColorMarkProps extends VariantProps<typeof variants> {
  /** 当前值 null, 0, 1, 2, 3, 4, 5 */
  value?: Array<string>;
  /** 切换时数据变更 */
  onChange?: (value: number) => {};
}

export function ColorMark(props: ColorMarkProps) {
  const [state, setState] = useControllableValue<Array<string> | undefined>(props, {
    defaultValue: [],
  });

  const className = 'w-3 h-3 fill-gray-300';
  const classNameActive = 'fill-blue-500 stroke-blue-500';
  const onStarClick = (v: any) => {
    setState(v);
  }

  return (
    <Space size={0} className="cursor-pointer">
      {colors.map((c: string) =>
        <Circle key={c} className={cn("w-3 h-3", c,)} strokeWidth={3} />
      )}
      {/* <CircleCheck className="w-3 h-3 fill-red-400 stroke-white" strokeWidth={1} /> */}
    </Space>
  )
}