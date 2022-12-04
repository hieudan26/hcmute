import { AxiosResponse } from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { async } from 'rxjs';
import { API_PATH } from '../../constants/api-path.constant';
import { AxiosResponseStatus } from '../../constants/global.constant';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';
import { IFriendRequest, IUserFirstLoginRequest, IUserUpdateInformation } from '../../models/user/user.model';
import { getAsync, postAsync, putAsync } from '../../utils/HttpClient.util';
import { LocalUtils } from '../../utils/local.utils';

class UserService {
  enableUser = async (userId: string): Promise<AxiosResponse<any>> => {
    var url = `/users/enable`;
    const params = {
      id: userId,
    };
    const result = await putAsync(url, params, 'Enable user successfully', false, true, true, undefined, undefined);
    return result;
  };

  disableUser = async (userId: string): Promise<AxiosResponse<any>> => {
    var url = `/users/disable`;
    const params = {
      id: userId,
    };
    const result = await putAsync(url, params, 'Disable user successfully', false, true, true, undefined, undefined);
    return result;
  };

  getUsers = async (
    params: IPaginationRequest | undefined,
    searchFirstName: string | undefined,
    searchLastName: string | undefined
  ): Promise<AxiosResponse<any>> => {
    var url = `/users`;
    const paramsMain = { ...params, firstName: searchFirstName, lastName: searchLastName };
    const result = await getAsync(url, paramsMain, false, false, true);
    return result;
  };

  createAdmin = async (
    model: IUserFirstLoginRequest,
    setSubmitting: Dispatch<SetStateAction<boolean>>
  ): Promise<AxiosResponse<any>> => {
    var url = `${API_PATH.USERS}/admin`;
    const result = await postAsync(url, model, 'Create new admin successfully', false, true, true, undefined, setSubmitting);
    return result;
  };

  getUserFriendStatus = async (userId: string, friendId: string): Promise<AxiosResponse<any>> => {
    var url = `users/${userId}/friends/${friendId}`;
    const result = await getAsync(url, undefined, false, false, true);
    return result;
  };

  updateStatusFriends = async (userId: string, params: IFriendRequest): Promise<AxiosResponse<any>> => {
    var url = `/users/${userId}/friends`;
    const result = await putAsync(url, params, undefined, false, false, true, undefined, undefined);
    return result;
  };

  getUserImages = async (userId: string, params: IPaginationRequest | undefined): Promise<AxiosResponse<any>> => {
    var url = `/users/${userId}/images`;
    const result = await getAsync(url, params, false, false, true);
    return result;
  };

  getUserFriends = async (
    userId: string,
    status: string | undefined,
    params: IPaginationRequest | undefined
  ): Promise<AxiosResponse<any>> => {
    var url = `/users/${userId}/friends`;
    const renewParams = { ...params, status: status };
    const result = await getAsync(url, renewParams, false, false, true);
    return result;
  };

  updateInformation = async (
    id: string,
    model: IUserUpdateInformation,
    setSubmitting: Dispatch<SetStateAction<boolean>>
  ): Promise<AxiosResponse<any>> => {
    var url = `/users/${id}`;
    const result = await putAsync(url, model, 'Update information successfully', false, true, false, undefined, setSubmitting);
    return result;
  };

  getUserInformationById = async (id: string): Promise<AxiosResponseStatus<any>> => {
    var url = `/users/${id}`;
    try {
      const result = await getAsync(url, undefined, false, false, true);
      result.isSuccess = true;
      return result;
    } catch (error: any) {
      return error.response.data;
    }
  };

  //for first login to store data
  getUserById = async (id: string): Promise<AxiosResponse<any>> => {
    var url = `/users/${id}`;
    const result = await getAsync(url, undefined, false, false, false);
    await LocalUtils.storeAuthenticationData();
    return result;
  };

  signUpAsync = async (
    model: IUserFirstLoginRequest,
    setSubmitting: Dispatch<SetStateAction<boolean>>
  ): Promise<AxiosResponse<any>> => {
    var url = API_PATH.SIGN_UP;
    const result = await postAsync(
      url,
      model,
      'Filling in some information success',
      false,
      true,
      true,
      undefined,
      setSubmitting
    );
    await LocalUtils.storeAuthenticationData(true);
    return result;
  };
}

export default new UserService();
