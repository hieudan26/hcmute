import { AxiosResponse } from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { API_PATH } from '../../constants/api-path.constant';
import { AxiosResponseStatus } from '../../constants/global.constant';
import { IUserFirstLoginRequest, IUserUpdateInformation } from '../../models/user/user.model';
import { getAsync, postAsync, putAsync } from '../../utils/HttpClient.util';
import { LocalUtils } from '../../utils/local.utils';

class UserService {
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
