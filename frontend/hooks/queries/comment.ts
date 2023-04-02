import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ICommentRequestModel,
  ICommentRequestModelCommentId,
  ICommentSubmittingRequestModel,
  IQueryGetCommentsPost,
} from '../../models/comment/comment.model';
import commentService from '../../services/comment/comment.service';
import postService from '../../services/post/post.service';

export const useCUDComment = () => {
  const queryClient = useQueryClient();

  const mutationCreateComment = useMutation(
    async (paramsSubmitting: ICommentSubmittingRequestModel) => {
      const { setSubmitting, ...params } = paramsSubmitting;
      await commentService.createComment(params, undefined);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['comments_post']);
        // queryClient.invalidateQueries(['posts_by_type']);
        // queryClient.invalidateQueries(['posts_by_type_userId']);
        // queryClient.invalidateQueries(['posts_by_type_hashTag']);
        queryClient.invalidateQueries(['post_by_Id']);
      },
    }
  );

  const mutationUpdateComment = useMutation(
    async (paramsSubmitting: ICommentRequestModelCommentId) => {
      const { setSubmitting, commentId, ...params } = paramsSubmitting;
      await commentService.updateComment(params, commentId, setSubmitting);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['comments_post']);
        // queryClient.invalidateQueries(['posts_by_type']);
        // queryClient.invalidateQueries(['posts_by_type_userId']);
        // queryClient.invalidateQueries(['posts_by_type_hashTag']);
        queryClient.invalidateQueries(['post_by_Id']);
      },
    }
  );

  const mutationDeleteComment = useMutation(
    async (commentId: number) => {
      await commentService.deleteComment(commentId, undefined);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['comments_post']);
        // queryClient.invalidateQueries(['posts_by_type']);
        // queryClient.invalidateQueries(['posts_by_type_userId']);
        // queryClient.invalidateQueries(['posts_by_type_hashTag']);
        queryClient.invalidateQueries(['post_by_Id']);
      },
    }
  );

  return { mutationCreateComment, mutationUpdateComment, mutationDeleteComment };
};

export const useCommentsPost = (params: IQueryGetCommentsPost, isEnable: boolean) => {
  return useInfiniteQuery(
    ['comments_post', params],
    async ({ pageParam = 0 }) => {
      const { postId, ...paramsNormal } = params;
      paramsNormal.pageNumber = pageParam;
      const response = await postService.getCommentsPost(postId, paramsNormal);
      return response;
    },
    {
      keepPreviousData: true,
      enabled: isEnable,
      getNextPageParam: (lastPage) => {
        const maxPages = lastPage.data.pageable.totalPages;
        const nextPage = lastPage.data.pageable.pageNumber + 1;
        return nextPage < maxPages ? nextPage : undefined;
      },
    }
  );
};
