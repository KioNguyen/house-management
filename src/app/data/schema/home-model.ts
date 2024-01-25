import { BaseDataItem } from './api-response';
import { House } from './house';

export interface HomeModel {
  model: string;
  house_type: string;
  media: HomeModelMedia;
}

export interface HomeModelMedia {
  title: string;
  video: string;
  banner: string;
  description: string;
}

export type HomeModelDisplayItem = BaseDataItem<
  HomeModel & { houses: BaseDataItem<House>[] }
>;
