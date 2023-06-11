import { AxiosResponseStatus } from '../../constants/global.constant';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';
import {
  IReviewTripRequestModel,
  ITripDayUpdateRequestModel,
  ITripRequestModel,
  ITripUpdateMemberModel,
  ITripsByUserIdRequestModel,
  ITripsRequestModel,
  IUpdateTripRequestJoinStatus,
} from '../../models/trip/trip.model';
import { deleteAsync, getAsync, postAsync, putAsync } from '../../utils/HttpClient.util';

class TripService {
  cancelRequestStatus = async (tripId: number): Promise<AxiosResponseStatus<any>> => {
    var url = `trips/${tripId}/request`;
    return await deleteAsync(url, 'Từ chối tham gia thành công', false, true, true, undefined, undefined);
  };

  getRequestByUserId = async (tripId: number, userId: string): Promise<AxiosResponseStatus<any>> => {
    var url = `trips/${tripId}/request/user/${userId}`;
    return await getAsync(url, undefined, false, false, true);
  };

  getRequestStatus = async (tripId: number): Promise<AxiosResponseStatus<any>> => {
    var url = `trips/${tripId}/request/status`;
    return await getAsync(url, undefined, false, false, true);
  };

  updateRequestStatus = async (tripId: number, params: IUpdateTripRequestJoinStatus): Promise<AxiosResponseStatus<any>> => {
    var url = `trips/${tripId}/request`;
    return await putAsync(url, params, 'Cập nhật thành công', false, true, true, undefined, undefined);
  };

  getAllRequestsJoinTrip = async (
    tripId: number,
    status: 'PENDING' | 'MEMBER' | 'REJECTED' | 'NONE',
    params: IPaginationRequest | undefined = undefined
  ): Promise<AxiosResponseStatus<any>> => {
    var url = `trips/${tripId}/request`;
    const rparams = { ...params, status: status };
    return await getAsync(url, rparams, false, false, true);
  };

  createRequestJoinTrip = async (tripId: number): Promise<AxiosResponseStatus<any>> => {
    var url = `trips/${tripId}/request`;
    return await postAsync(url, undefined, 'Gửi yêu cầu thành công', false, true, true, undefined, undefined);
  };

  getTripsByUserId = async (params: ITripsByUserIdRequestModel): Promise<AxiosResponseStatus<any>> => {
    var url = `trips/user/${params.id}`;
    return await getAsync(url, params, false, false, true);
  };

  createReviewTrip = async (tripId: number, params: IReviewTripRequestModel): Promise<AxiosResponseStatus<any>> => {
    var url = `trips/${tripId}/reviews`;
    return await postAsync(url, params, 'Tạo thành công', false, true, true, undefined, undefined);
  };

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
