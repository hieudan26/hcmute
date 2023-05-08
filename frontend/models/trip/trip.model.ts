export interface ITripsResponseModel {
  id: number;
  title: string;
  ownerId: string;
  type: string;
  maxMember: number;
  maxDay: number;
  startingPlace: number;
  totalPrice: number;
  description: string;
  startTime: string;
  endTime: string;
  status: string;
  shortDescription: string;
  tripDays: ITripDayResponseModel[];
  tripMembers: ITripMemberResponseModel[];
}

export interface ITripMemberResponseModel {
  role: string;
  userId: string;
  tripId: number;
}

export interface ITripDayResponseModel {
  id: number;
  tripId: number;
  ordinal: number;
  description: string;
  date: string;
  tripPlaces: ITripPlaceResponseModel[];
}

export interface ITripPlaceResponseModel {
  id: number;
  placeId: number;
  ordinal: number;
  transport: string;
  travelTime: string;
  travelPrice: string;
  startTime: string;
  endTime: string;
  dayId: number;
  tripPlaceFees: ITripPlaceFeesResponseModel[];
}

export interface ITripPlaceFeesResponseModel {
  id: number;
  tripPlaceId: number;
  name: string;
  value: number;
  description: string;
  isRequired: true;
}

export interface ITripsRequestModel {
  key: string | undefined;
  pageNumber: number | undefined;
  pageSize: number | undefined;
  sortBy: string | undefined;
  sortType: string | undefined;
  status: 'Private' | 'Public' | undefined;
  type: 'Plan' | 'Adventure' | undefined;
}

export interface ITripRequestModel {
  description: string | undefined;
  endTime: string | undefined;
  maxDay: number;
  maxMember: number;
  shortDescription: string | undefined;
  startTime: string;
  startingPlace: number;
  status: 'Public' | 'Private';
  title: string;
  totalPrice: number;
  type: 'Plan' | 'Adventure';
  // tripDays: ITripDayResponseModel[] | undefined;
  // tripMembers: ITripMemberResponseModel[] | undefined;
}

export interface ITripUpdateMemberModel {
  role: string;
  userId: string;
}
