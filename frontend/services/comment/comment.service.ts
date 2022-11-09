import { Dispatch, SetStateAction } from 'react';
import { API_PATH } from '../../constants/api-path.constant';
import { AxiosResponseStatus } from '../../constants/global.constant';
import { ICommentRequestModel } from '../../models/comment/comment.model';
import { deleteAsync, postAsync, putAsync } from '../../utils/HttpClient.util';

class CommentService {
  deleteComment = async (
    commentId: number,
    setSubmitting: Dispatch<SetStateAction<boolean>> | undefined
  ): Promise<AxiosResponseStatus<any>> => {
    var url = `${API_PATH.COMMENT}/${commentId}`;
    const result = await deleteAsync(url, 'Delete comment successfully', false, true, true, undefined, setSubmitting);
    return result;
  };

  updateComment = async (
    model: ICommentRequestModel,
    commentId: number,
    setSubmitting: Dispatch<SetStateAction<boolean>> | undefined
  ): Promise<AxiosResponseStatus<any>> => {
    var url = `${API_PATH.COMMENT}/${commentId}`;
    const result = await putAsync(url, model, 'Update comment successfully', false, true, true, undefined, setSubmitting);
    return result;
  };

  createComment = async (
    model: ICommentRequestModel, //dd/MM/yyyy Hh:mm:ss
    setSubmitting: Dispatch<SetStateAction<boolean>> | undefined
  ): Promise<AxiosResponseStatus<any>> => {
    var url = API_PATH.COMMENT;
    const result = await postAsync(url, model, 'Create comment successfully', false, true, true, undefined, setSubmitting);
    return result;
  };
}

export default new CommentService();
