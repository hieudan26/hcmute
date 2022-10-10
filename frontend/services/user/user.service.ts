import { AxiosResponse } from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { API_PATH } from '../../constants/api-path.constant';
import { IUserFirstLoginRequest } from '../../models/user/user.model';
import { getAsync, postAsync } from '../../utils/HttpClient.util';
import { LocalUtils } from '../../utils/local.utils';

class UserService {
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
