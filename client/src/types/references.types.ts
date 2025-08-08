export interface IListInfo {
  _id?: string;
  title: string;
  description: string;
}

export interface IReferencesResponse {
  _id: string;
  name: string;
  name_eng: string;
  title: string;
  description: string;
  manager: string;
  titleImage?: {
    _id: string;
    path: string;
    filename: string;
  };
  listInfo: IListInfo[];
  createdAt: string;
  updatedAt: string;
} 