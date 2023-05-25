import { IPlaceCountryResponse } from '../place/place.model';
import { IUserFirstLoginRequest } from '../user/user.model';

export const responseToUpdateTripDay = (params: ITripDayResponseModel): ITripDayUpdateRequestModel => {
  let provinceList: number[] = [];
  params.provinces.map((x) => {
    provinceList.push(x.id);
  });

  let tripPlaceList: ITripPlaceUpdateRequestModel[] = [];
  params.tripPlaces.map((x) => {
    let temp = responseToUpdateTripPlace(x);
    tripPlaceList.push(temp);
  });

  return {
    id: params.id,
    date: params.date,
    description: params.description,
    ordinal: params.ordinal,
    provinces: provinceList,
    tripPlaces: tripPlaceList,
  };
};

export const responseToUpdateTripPlace = (params: ITripPlaceResponseModel): ITripPlaceUpdateRequestModel => {
  let tripPlaceFeeList: ITripPlaceFeeUpdateRequestModel[] = [];
  params.tripPlaceFees.map((x) => {
    let temp = responseToUpdatePlaceFee(x);
    tripPlaceFeeList.push(temp);
  });

  return {
    id: params.id,
    placeId: params.place.id,
    endTime: params.endTime,
    ordinal: params.ordinal,
    startTime: params.startTime,
    transport: params.transport,
    travelPrice: params.travelPrice,
    travelTime: params.travelTime,
    tripPlaceFees: tripPlaceFeeList,
  };
};

export const responseToUpdatePlaceFee = (params: ITripPlaceFeesResponseModel): ITripPlaceFeeUpdateRequestModel => {
  let result: ITripPlaceFeeUpdateRequestModel = {
    id: params.id,
    description: params.description,
    isRequired: params.isRequired,
    name: params.name,
    value: params.value,
  };
  return result;
};

export interface IReviewTripRequestModel {
  content: string;
  rate: number;
}

export interface ITripReviewResponseModel {
  id: number;
  rate: number;
  content: string;
  tripId: number;
  owner: IUserFirstLoginRequest;
  reviewAt: string;
}

export interface ITripDayUpdateRequestModel {
  date: string;
  description: string;
  id: number;
  ordinal: number;
  provinces: number[];
  tripPlaces: ITripPlaceUpdateRequestModel[];
}

export interface ITripPlaceUpdateRequestModel {
  endTime: string;
  id: number;
  ordinal: number;
  placeId: number;
  startTime: string;
  transport: string;
  travelPrice: string;
  travelTime: string;
  tripPlaceFees: ITripPlaceFeeUpdateRequestModel[];
}

export interface ITripPlaceFeeUpdateRequestModel {
  description: string;
  id: number;
  isRequired: boolean;
  name: string;
  value: number;
}

export interface ITripsResponseModel {
  id: number;
  title: string;
  ownerId: string;
  ownerInfo: IUserFirstLoginRequest;
  type: string;
  maxMember: number;
  maxDay: number;
  startingPlace: number;
  startingPlaceInfo: IPlaceCountryResponse;
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
  provinces: IPlaceCountryResponse[];
}

export interface ITripPlaceResponseModel {
  id: number;
  place: IPlaceCountryResponse;
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

export interface ITripsByUserIdRequestModel extends ITripsRequestModel {
  id: string | undefined;
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
