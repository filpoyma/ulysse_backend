import { IUploadedImage } from './uploadImage.types.ts';

export interface IFirstPageData {
  title: string;
  subtitle: string;
  footer: string;
}

export interface IAccommodation {
  period: string;
  hotelName: string;
  details: string;
  numOfNights: number;
}

export type TRouteType = 'driving' | 'helicopter' | 'flight' | 'yacht' | 'train';
export type TSourceListIcon = 'driving' | 'helicopter' | 'flight' | 'yacht' | 'train';

export interface ILogistics {
  _id: string;
  city: string;
  coordinates: [number, number];
  hotel: string;
  sourceListIcon: TSourceListIcon;
  sourceMapIcon: 'startPoint';
  routeType: TRouteType;
  time: string;
  distance: string;
  markerColor?: string;
}

export interface IFourthDayData {
  header: { date: Date; dayIndex: number };
  title: string;
  nights: number;
  subtitle: string;
  description: string;
  pros: string[];
  info: string[];
  schedule: { title: string; description: string }[];
}

export interface ITravelProgramResponse {
  _id: string;
  id: string;
  name: string;
  name_eng: string;
  manager: string;
  days: number;
  bgImages: IUploadedImage[];
  firstPage: {
    title: string;
    subtitle: string;
    footer: string;
  };
  secondPageTables: {
    routeDetailsTable: {
      review: {
        day: string;
        numOfDay: number;
        id: string;
        activity: {
          id: string;
          icon: string;
          dayActivity: {
            id: string;
            line1: string;
            line2: string;
            line3: string;
            isFlight: boolean;
            more: string;
          };
        }[];
      }[];
    };
    accommodation: IAccommodation[];
  };
  thirdPageMap: {
    id: string;
    logistics: ILogistics[];
    mapCenter: [number, number];
    zoom: number;
  };
  fourthPageDay: {
    gallery: IUploadedImage[];
    daysData: IFourthDayData[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface TravelProgramSingleResponse {
  data: ITravelProgramResponse;
}
