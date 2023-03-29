import { AxiosResponseStatus } from '../../constants/global.constant';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';
import { getAsync, putAsync } from '../../utils/HttpClient.util';

class NotificationService {
  readAllNotifications = async (listNotifications: string[] | undefined, status: boolean): Promise<AxiosResponseStatus<any>> => {
    var url = `notification`;
    var mainParams = { listNotifications: listNotifications, status: status };
    return putAsync(url, mainParams, undefined, false, false, false, undefined, undefined);
  };

  countNotifications = async (isRead: boolean): Promise<AxiosResponseStatus<any>> => {
    var url = `notification/count`;
    return getAsync(url, { isRead: isRead }, false, false, true);
  };

  getNotifications = async (params: IPaginationRequest | undefined, isRead?: boolean): Promise<AxiosResponseStatus<any>> => {
    var url = `notification`;
    var mainParams = { ...params, isRead: isRead };
    return getAsync(url, mainParams, false, false, true);
  };
}

export default new NotificationService();
