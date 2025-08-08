export interface IHotelsList {
  _id: string;
  name: string;
  description: string;
  hotels: string[];
  isActive: boolean;
  sortOrder: number;
  titleImage: {
    _id: string;
    path: string;
    filename: string;
  };
  metadata: {
    totalHotels: number;
    lastUpdated: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IHotelsListWithHotels extends Omit<IHotelsList, 'hotels'> {
  hotels: Array<{
    _id: string;
    name: string;
    country: string;
    region: string;
    mainImage: {
      _id: string;
      path: string;
      filename: string;
    };
    coordinates: [number, number];
  }>;
}

export interface IHotelsListStats {
  totalLists: number;
  activeLists: number;
  totalHotels: number;
  avgHotelsPerList: number;
}

export interface ICreateHotelsListData {
  name: string;
  description?: string;
  hotels?: string[];
  sortOrder?: number;
}

export interface IUpdateHotelsListData {
  name?: string;
  description?: string;
  hotels?: string[];
  isActive?: boolean;
  sortOrder?: number;
  titleImage?: string;
}
