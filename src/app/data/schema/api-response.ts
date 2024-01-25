export interface APIResponse<T> {
  data: BaseDataItem<T>;
}
export interface APIResponsePagination<T> {
  data: BaseDataItem<T>[];
  meta: {
    record_count: number;
  };
}

export interface BaseDataItem<T> {
  id: string;
  links: { [key: string]: string };
  type: string;
  attributes: T;
}
