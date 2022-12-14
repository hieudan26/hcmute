import { AxiosResponseStatus } from '../../constants/global.constant';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';
import { getAsync } from '../../utils/HttpClient.util';

class HashtagService {
  getImages = async (
    params: IPaginationRequest | undefined,
    hashTag: string,
    type: string
  ): Promise<AxiosResponseStatus<any>> => {
    var url = `hashtags/images`;
    const mainParams = { ...params, hashtag: hashTag, type: type };
    return getAsync(url, mainParams, false, false, true);
  };

  findHashTag = async (
    params: IPaginationRequest | undefined,
    hashTag: string | undefined
  ): Promise<AxiosResponseStatus<any>> => {
    var url = `hashtags`;
    const mainParams = { ...params, hashTag: hashTag };
    return getAsync(url, mainParams, false, false, true);
  };
}

export default new HashtagService();
