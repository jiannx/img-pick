import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox";
import { useCurrentWorkspace } from "@/hooks";
import { useStore, File } from "@/store";
import { Trash2 } from "lucide-react"
import { useState } from "react";

interface DeleteConfirmProps extends React.HTMLAttributes<HTMLDivElement> {

}

export default function DeleteConfirm({ }: DeleteConfirmProps) {
  const { dir, files, selectedFiles, onSelectAll, onUnselectAll, onDeleteSelectedFile } = useCurrentWorkspace();
  const { setting, setSetting } = useStore();
  const [sameNameFiles, setSameNameFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog
      onOpenChange={(_open) => {
        if (_open) {
          const sameNameFiles = dir?.files
            .filter(f => !selectedFiles.find(sf => sf.id === f.id))
            .filter(f => selectedFiles.find(sf => sf.pureName === f.pureName));
          setSameNameFiles(sameNameFiles || []);
        } else {
          setSameNameFiles([]);
        }
        setOpen(_open);
      }}
      open={open}
    >
      <AlertDialogTrigger asChild>
        <Button variant="secondary" size={'xs'}>
          <Trash2 size={16} strokeWidth={1} />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除？</AlertDialogTitle>
          <div className="pt-2 text-sm text-muted-foreground">
            <div className="text-black">
              即将删除 {selectedFiles.length} 个图片，请确认删除！
            </div>
            <div className="max-h-20 max-w-full break-all overflow-auto" >
              {selectedFiles.map(f => <span className="px-1">{f.name}</span>)}
            </div>
            {sameNameFiles && sameNameFiles?.length > 0 &&
              <div className="mt-2">
                <div className="text-black">
                  当前文件夹中存在 {sameNameFiles?.length} 与删除列表中相同名称的文件，
                  <Checkbox
                    checked={setting.autoDeleteSameNameFile}
                    onCheckedChange={(v: boolean) => setSetting({ autoDeleteSameNameFile: v })}
                  />&nbsp;同时进行删除？
                </div>
                <div className="max-h-20 max-w-full break-all overflow-auto" >
                  {sameNameFiles?.map(f => <span className="px-1">{f.name}</span>)}
                </div>
              </div>
            }
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="items-center">
          <Checkbox
            checked={!setting.deleteConfirmBefore}
            onCheckedChange={(v: boolean) => setSetting({ deleteConfirmBefore: !v })}
          />&nbsp;不再提示
          <Button variant='outline' onClick={() => setOpen(false)}>取消</Button>
          <Button>删除</Button>
        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  )
}