import _ from 'lodash';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox"
import { Filter as FilterIcon } from "lucide-react"
import { useCurrentWorkspace, useStore, useActions } from '@/hooks';

export default function Filter() {
  const { dirFilterSet } = useActions();
  const { dir, filter } = useCurrentWorkspace();
  // 基于全量文件获取所有后缀
  const fileSuffixes = _.uniq(dir?.files.map(f => f.suffix));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="secondary" size={'xs'}>
          <FilterIcon size={16} strokeWidth={1} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="end">
        <DropdownMenuLabel>筛选</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Checkbox checked={filter?.markAsDelete} onCheckedChange={(v) => dirFilterSet(dir, 'markAsDelete', v)} />&nbsp;已标记删除
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Checkbox checked={filter?.notMarkAsDelete} onCheckedChange={(v) => dirFilterSet(dir, 'notMarkAsDelete', v)} />&nbsp;未标记删除
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {fileSuffixes?.map(suffix =>
          <DropdownMenuItem >
            <Checkbox
              checked={filter?.suffixes?.includes(suffix)}
              onCheckedChange={(v) => {
                let suffixes = filter?.suffixes || [];
                if (suffixes?.includes(suffix)) {
                  suffixes = suffixes.filter(s => s !== suffix);
                } else {
                  suffixes?.push(suffix)
                }
                dirFilterSet(dir, 'suffixes', suffixes);
              }}
            />&nbsp;{suffix}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}