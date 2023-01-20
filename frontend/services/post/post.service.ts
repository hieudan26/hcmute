import { Dispatch, SetStateAction } from 'react';
import { API_PATH } from '../../constants/api-path.constant';
import { AxiosResponseStatus } from '../../constants/global.constant';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';
import { IPostPaginationByType, IPostPaginationByTypeAndUserId, IPostRequestModel } from '../../models/post/post.model';
import { deleteAsync, getAsync, postAsync, putAsync } from '../../utils/HttpClient.util';

class PostService {
  getAllPostsByTypeAndHashTag = async (
    params: IPaginationRequest | undefined,
    type: string,
    hashTags: string[],
    isDeleted: boolean = false
  ): Promise<AxiosResponseStatus<any>> => {
    var url = API_PATH.POST;
    const mainParams = { ...params, type: type, hashTags: hashTags, isDeleted: isDeleted };
    return getAsync(url, mainParams, false, false, true);
  };

  getAllPostsDeleted = async (
    params: IPaginationRequest | undefined,
    isDeleted: boolean | undefined,
    type: string | undefined
  ): Promise<AxiosResponseStatus<any>> => {
    var url = API_PATH.POST;
    const mainParams = { ...params, isDeleted, type };
    const result = await getAsync(url, mainParams, false, false, true);
    return result;
  };

  getPostById = async (postId: string): Promise<AxiosResponseStatus<any>> => {
    var url = `${API_PATH.POST}/${postId}`;
    try {
      const result = await getAsync(url, undefined, false, false, true);
      result.isSuccess = true;
      return result;
    } catch (error: any) {
      return error;
    }
  };

  deletePost = async (postId: string): Promise<AxiosResponseStatus<any>> => {
    var url = `${API_PATH.POST}/${postId}`;
    const result = await deleteAsync(url, 'Delete post successfully', false, true, true, undefined, undefined);
    return result;
  };

  updatePost = async (
    model: IPostRequestModel,
    postId: string,
    setSubmitting: Dispatch<SetStateAction<boolean>> | undefined
  ): Promise<AxiosResponseStatus<any>> => {
    var url = `${API_PATH.POST}/${postId}`;
    const result = await putAsync(url, model, 'Update post successfully', false, true, true, undefined, setSubmitting);
    return result;
  };

  getCommentsPost = async (postId: string, params: IPaginationRequest | undefined): Promise<AxiosResponseStatus<any>> => {
    var url = `${API_PATH.POST}/${postId}/comments`;
    const result = await getAsync(url, params, false, false, true);
    return result;
  };

  reactPost = async (postId: string) => {
    var url = `${API_PATH.POST}/${postId}/react`;
    const result = await putAsync(url, undefined, undefined, false, false, true);
    return result;
  };

  getAllPostsByTypeAndUserId = async (params: IPostPaginationByTypeAndUserId | undefined): Promise<AxiosResponseStatus<any>> => {
    var url = API_PATH.POST;
    const result = await getAsync(url, params, false, false, true);
    return result;
  };

  getAllPostsByType = async (params: IPostPaginationByType | undefined): Promise<AxiosResponseStatus<any>> => {
    var url = API_PATH.POST;
    const result = await getAsync(url, params, false, false, true);
    return result;
  };

  getAllPosts = async (params: IPaginationRequest | undefined): Promise<AxiosResponseStatus<any>> => {
    var url = API_PATH.POST;
    const result = await getAsync(url, params, false, false, true);
    return result;
  };

  createPost = async (
    model: IPostRequestModel, //dd/MM/yyyy Hh:mm:ss
    setSubmitting: Dispatch<SetStateAction<boolean>> | undefined
  ): Promise<AxiosResponseStatus<any>> => {
    var url = API_PATH.POST;
    const result = await postAsync(url, model, 'Create post successfully', false, true, true, undefined, setSubmitting);
    return result;
  };
}

export default new PostService();
