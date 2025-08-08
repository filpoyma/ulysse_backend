export interface IRestaurantsList {
  _id: string;
  name: string;
  description: string;
  restaurants: string[];
  isActive: boolean;
  sortOrder: number;
  titleImage?: {
    _id: string;
    path: string;
    filename: string;
  };
  metadata: {
    totalRestaurants: number;
    lastUpdated: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IRestaurantsListWithRestaurants extends Omit<IRestaurantsList, 'restaurants'> {
  restaurants: Array<{
    _id: string;
    name: string;
    country: string;
    city: string;
    region: string;
    titleImage: {
      _id: string;
      path: string;
      filename: string;
    };
    coordinates: [number, number];
  }>;
}

export interface ICreateRestaurantsListData {
  name: string;
  description?: string;
  restaurants?: string[];
  sortOrder?: number;
}

export interface IUpdateRestaurantsListData {
  name?: string;
  description?: string;
  restaurants?: string[];
  isActive?: boolean;
  sortOrder?: number;
  titleImage?: string;
} 