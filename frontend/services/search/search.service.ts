import { AxiosResponseStatus } from '../../constants/global.constant';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';
import { getAsync } from '../../utils/HttpClient.util';

class SearchService {
  searchByType_Loading = async (
    params: IPaginationRequest | undefined,
    key: string,
    type: 'experience' | 'faq' | 'place' | 'user'
  ): Promise<AxiosResponseStatus<any>> => {
    var url = `find`;
    const mainParams = { ...params, key: key, type: type };
    const result = await getAsync(url, mainParams, true, false, true);
    return result;
  };

  searchByType = async (
    params: IPaginationRequest | undefined,
    key: string,
    type: 'experience' | 'faq' | 'place' | 'user'
  ): Promise<AxiosResponseStatus<any>> => {
    var url = `find`;
    const mainParams = { ...params, key: key, type: type };
    const result = await getAsync(url, mainParams, false, false, true);
    return result;
  };
}

export default new SearchService();
