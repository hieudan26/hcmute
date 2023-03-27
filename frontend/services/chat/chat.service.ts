import { async } from 'rxjs';
import { API_PATH } from '../../constants/api-path.constant';
import { AxiosResponseStatus } from '../../constants/global.constant';
import { IRoomRequest } from '../../models/chat/chat.model';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';
import { getAsync, postAsync } from '../../utils/HttpClient.util';

class ChatService {
  getRoom = async (roomId: string): Promise<AxiosResponseStatus<any>> => {
    var url = `${API_PATH.CHAT}/${roomId}`;
    try {
      const result = await getAsync(url, undefined, false, false, true);
      result.isSuccess = true;
      return result;
    } catch (error: any) {
      return error;
    }
  };

  createRooms = async (params: IRoomRequest): Promise<AxiosResponseStatus<any>> => {
    var url = `${API_PATH.CHAT}`;
    const result = await postAsync(url, params, 'Tạo phòng chat thành công', false, true, true, undefined, undefined);
    return result;
  };

  isInRoom = async (friendId: string): Promise<AxiosResponseStatus<any>> => {
    var url = `${API_PATH.CHAT}/friends/${friendId}`;
    try {
      const result = await getAsync(url, undefined, false, false, true);
      result.isSuccess = true;
      return result;
    } catch (error: any) {
      return error;
    }
  };

  getMessages = async (params: IPaginationRequest | undefined, roomId: string | number): Promise<AxiosResponseStatus<any>> => {
    var url = `${API_PATH.CHAT}/${roomId}/messages`;
    try {
      const result = await getAsync(url, params, false, false, true);
      result.isSuccess = true;
      return result;
    } catch (error: any) {
      return error;
    }
  };

  //type: string
  getRooms = async (params: IPaginationRequest | undefined): Promise<AxiosResponseStatus<any>> => {
    var url = `${API_PATH.CHAT}`;
    try {
      const result = await getAsync(url, params, false, false, true);
      result.isSuccess = true;
      return result;
    } catch (error: any) {
      return error.response.data;
    }
  };
}

export default new ChatService();
