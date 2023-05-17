import { AxiosResponseStatus } from '../../constants/global.constant';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';
import {
  ITripRequestModel,
  ITripUpdateMemberModel,
  ITripDayUpdateRequestModel,
  ITripsRequestModel,
} from '../../models/trip/trip.model';
import { getAsync, postAsync, putAsync } from '../../utils/HttpClient.util';

class TripService {
  getReviewsTrip = async (tripId: number, params: IPaginationRequest | undefined): Promise<AxiosResponseStatus<any>> => {
    var url = `trips/${tripId}/reviews`;
    return await getAsync(url, params, false, false, true);
  };

  updateTripDays = async (tripId: number, params: ITripDayUpdateRequestModel[]): Promise<AxiosResponseStatus<any>> => {
    var url = `trips/${tripId}/days`;
    return await putAsync(url, params, 'Cập nhật thành công', false, false, true, undefined, undefined);
  };

  updateTripMembers = async (tripId: number, params: ITripUpdateMemberModel[]): Promise<AxiosResponseStatus<any>> => {
    var url = `trips/${tripId}/members`;
    return await putAsync(url, params, 'Cập nhật thành viên thành công', false, true, true, undefined);
  };

  getTripMembers = async (
    tripId: number,
    key: string | undefined,
    params: IPaginationRequest | undefined
  ): Promise<AxiosResponseStatus<any>> => {
    var url = `trips/${tripId}/members`;
    let rParams = { ...params, key: key };
    return await getAsync(url, rParams, false, false, true);
  };

  updateTrip = async (id: number, params: ITripRequestModel): Promise<AxiosResponseStatus<any>> => {
    var url = `trips/${id}`;
    return await putAsync(url, params, 'Cập nhật thành công', false, false, true, undefined, undefined);
  };

  getTripById = async (id: number): Promise<AxiosResponseStatus<any>> => {
    var url = `trips/${id}`;
    return await getAsync(url, undefined, false, false, true);
  };

  getTrips = async (params: ITripsRequestModel): Promise<AxiosResponseStatus<any>> => {
    var url = `trips`;
    const result = await getAsync(url, params, false, false, true);
    return result;
  };

  createTrip = async (params: ITripRequestModel): Promise<AxiosResponseStatus<any>> => {
    var url = `trips`;
    const result = await postAsync(url, params, 'Tạo mới thành công', false, true, true, undefined, undefined);
    return result;
  };
}

export default new TripService();
