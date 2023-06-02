import { async } from 'rxjs';
import { API_PATH } from '../../constants/api-path.constant';
import { AxiosResponseStatus } from '../../constants/global.constant';
import { IRoomRequest } from '../../models/chat/chat.model';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';
import { deleteAsync, getAsync, postAsync, putAsync } from '../../utils/HttpClient.util';

class ChatService {
  unlockRoomSingle = async (roomId: string): Promise<AxiosResponseStatus<any>> => {
    var url = `${API_PATH.CHAT}/${roomId}/unlock`;
    const result = putAsync(url, undefined, 'Mở chặn người dùng thành công', false, true, true, undefined, undefined);
    return result;
  };

  lockRoomSingle = async (roomId: string): Promise<AxiosResponseStatus<any>> => {
    var url = `${API_PATH.CHAT}/${roomId}/block`;
    const result = putAsync(url, undefined, 'Chặn người dùng thành công', false, true, true, undefined, undefined);
    return result;
  };

  getStatusRoom = async (roomId: string): Promise<AxiosResponseStatus<any>> => {
    var url = `${API_PATH.CHAT}/${roomId}/status`;
    const result = await getAsync(url, undefined, false, true);
    return result;
  };

  deleteRoom = async (roomId: string): Promise<AxiosResponseStatus<any>> => {
    var url = `${API_PATH.CHAT}/${roomId}`;
    const result = await deleteAsync(url, 'Xóa phòng trò chuyện thành công', false, true, true, undefined, undefined);
    return result;
  };

  leaveRoom = async (roomId: string): Promise<AxiosResponseStatus<any>> => {
    var url = `${API_PATH.CHAT}/${roomId}/leave`;
    const result = await putAsync(url, undefined, 'Rời phòng trò chuyện thành công', false, true, true, undefined, undefined);
    return result;
  };

  removeMemberInRoom = async (roomId: string, userId: string): Promise<AxiosResponseStatus<any>> => {
    var url = `${API_PATH.CHAT}/${roomId}/members/${userId}`;
    const result = await deleteAsync(url, 'Đuổi thành viên thành công', false, true, true, undefined, undefined);
    return result;
  };

  updateRoom = async (params: IRoomRequest, roomId: string): Promise<AxiosResponseStatus<any>> => {
    var url = `${API_PATH.CHAT}/${roomId}`;
    const result = await putAsync(url, params, 'Cập nhật thành công', false, true, true, undefined, undefined);
    return result;
  };

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
  getRooms = async (params: IPaginationRequest | undefined, type: string): Promise<AxiosResponseStatus<any>> => {
    var url = `${API_PATH.CHAT}`;
    try {
      const newParams = { ...params, type: type };
      const result = await getAsync(url, newParams, false, false, true);
      result.isSuccess = true;
      return result;
    } catch (error: any) {
      return error.response.data;
    }
  };
}

export default new ChatService();
