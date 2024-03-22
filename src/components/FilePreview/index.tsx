import { File } from "@/store";
import { useEffect, useRef, useState } from "react";
import { readImageToUrl } from '@/utils';
import { useAsyncEffect, useInViewport, useSetState } from "ahooks";
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { Center, Image } from "@chakra-ui/react";
import { invoke } from '@tauri-apps/api/tauri'

async function read() {
  // await readImageToUrl('/Users/hao/a/DSCF1675.JPG');
  const assetUrl = convertFileSrc('/Users/hao/a/DSCF1675.JPG');
  console.log(assetUrl)
}
read();


export default function FilePreview({ file, ...otherProps }: {
  file?: File;
  [key: string]: any;
}) {

  const ref = useRef(null);
  const [inViewport] = useInViewport(ref);
  const [t, setT] = useState('');

  useAsyncEffect(async () => {
    // console.log('useAsyncEffect', file?.path,);

    // if (inViewport && !state.url) {
    //   if (file.suffixs?.includes('JPG')) {
    //     const url = await readImageToUrl(`${file.dir}/${file.pureName}.JPG`);
    //     setState({
    //       url,
    //     });
    //   }
    // }
  }, [file, inViewport]);

  useAsyncEffect(async () => {
    console.log('useAsyncEffect');
    if (file?.path) {
      // const str = await invoke('get_base64', { path: file?.path, size: 100, quality: 10 });
      // console.log('--str', {str})
      // setT('data:image/jpeg;base64,' + str);
    }
  }, []);

  return (
    <Center ref={ref} style={{ height: '100%', width: '100%' }}>
      {inViewport && <Image src={file?.url} alt="" style={{ maxHeight: '100%', maxWidth: '100%' }} boxShadow='base' />}
    </Center>
  )
}

