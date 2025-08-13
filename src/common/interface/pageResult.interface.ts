import { PageMeta } from './pageMeta.interface';
export interface PageResult<T> {
  data: T[];
  meta: PageMeta;
}
