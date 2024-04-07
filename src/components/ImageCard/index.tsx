import { Box } from '@chakra-ui/react';
import { File } from '@/store';
import FilePreview from "../FilePreview";


export default function ImageCard({
  file,
  onClick,
}: {
  file?: File;
  name: string;
  onClick: () => void;
}) {

  return (
    <Box
      w={'100px'}
      flexShrink={0}
      borderWidth='1px'
      borderRadius='lg'
      overflow='hidden'
      cursor={'pointer'}
      mx={2}
      onClick={onClick}
    >
      <FilePreview file={file} />
    </Box>
  )
}