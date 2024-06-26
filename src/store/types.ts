export enum Suffix {
  PNG = 'PNG',
  JPG = 'JPG',
  RAF = 'RAF',
};

export const ImagesSuffix: string[] = [Suffix.JPG, Suffix.PNG, Suffix.RAF];

export enum FileTag {
  Del = 'del',
  NotDel = 'notDel'
}

export interface Dir {
  id: string;
  /** 目录地址 */
  path: string;
  /** 目录名称 */
  name: string;
  files: File[];
  selected: boolean;
  /** 文件夹过滤参数 */
  filter: {
    markAsDelete?: boolean;
    notMarkAsDelete?: boolean;
    suffixes?: Suffix[]
  };
}
/** 文件 */
export interface File {
  /* 文件唯一id */
  id: string;
  /** 文件所属目录 */
  dir: string;
  /** 文件地址 */
  path: string;
  /** 文件名 */
  name: string;
  /** 文件服务地址 */
  url: string;
  /** 文件名，不包含后缀 */
  pureName: string;
  /** 后缀名 */
  suffix: Suffix;
  /** 是否选中 */
  selected?: boolean;
  /** 标记信息 */
  mark?: {
    delete?: boolean;
    star?: number;
  },
  /** 文件信息 */
  info? : {

  },
}
