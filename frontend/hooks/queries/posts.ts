import {
  InfiniteData,
  InitialDataFunction,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosResponseStatus } from '../../constants/global.constant';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';
import {
  IPostPaginationByType,
  IPostPaginationByTypeAndUserId,
  IPostRequestModelLoading,
  IPostRequestModelPostId,
} from '../../models/post/post.model';
import postService from '../../services/post/post.service';

interface IPostPaginationByTypeAndHashTag {
  pagination: IPaginationRequest;
  type: string;
  hashTags: string[];
  isDeleted: boolean;
}

export const useCUDPost = () => {
  const queryClient = useQueryClient();

  const mutationReactPost = useMutation(
    async (postId: string) => {
      await postService.reactPost(postId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['posts_by_type']);
        queryClient.invalidateQueries(['posts_by_type_userId']);
        queryClient.invalidateQueries(['comments_post']);
        queryClient.invalidateQueries(['posts_by_type_hashTag']);
        queryClient.invalidateQueries(['post_by_Id']);
      },
    }
  );

  const mutationCreatePost = useMutation(
    async (paramsLoading: IPostRequestModelLoading) => {
      const { setSubmitting, ...params } = paramsLoading;
      await postService.createPost(params, setSubmitting);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['posts_by_type']);
        queryClient.invalidateQueries(['posts_by_type_userId']);
        queryClient.invalidateQueries(['comments_post']);
        queryClient.invalidateQueries(['posts_by_type_hashTag']);
        queryClient.invalidateQueries(['post_by_Id']);
      },
    }
  );

  const mutationUpdatePost = useMutation(
    async (paramsPostId: IPostRequestModelPostId) => {
      const { postId, ...params } = paramsPostId;
      await postService.updatePost(params, postId, undefined);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['posts_by_type']);
        queryClient.invalidateQueries(['posts_by_type_userId']);
        queryClient.invalidateQueries(['comments_post']);
        queryClient.invalidateQueries(['posts_by_type_hashTag']);
        queryClient.invalidateQueries(['post_by_Id']);
      },
    }
  );

  const mutationDeletePost = useMutation(
    async (postId: string) => {
      await postService.deletePost(postId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['posts_by_type']);
        queryClient.invalidateQueries(['posts_by_type_userId']);
        queryClient.invalidateQueries(['comments_post']);
        queryClient.invalidateQueries(['posts_by_type_hashTag']);
        queryClient.invalidateQueries(['post_by_Id']);
      },
    }
  );

  return { mutationCreatePost, mutationReactPost, mutationUpdatePost, mutationDeletePost };
};

export const usePostsByTypeAndHashTag = (params: IPostPaginationByTypeAndHashTag) => {
  return useInfiniteQuery(
    ['posts_by_type_hashTag', params],
    async ({ pageParam = 0 }) => {
      params.pagination.pageNumber = pageParam;
      const response = await postService.getAllPostsByTypeAndHashTag(
        params.pagination,
        params.type,
        params.hashTags,
        params.isDeleted
      );
      return response;
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage) => {
        const maxPages = lastPage.data.pageable.totalPages;
        const nextPage = lastPage.data.pageable.pageNumber + 1;
        return nextPage < maxPages ? nextPage : undefined;
      },
    }
  );
};

export const usePostsById = (id: string, initialData: any | undefined, isEnable: boolean) => {
  return useQuery(
    ['post_by_Id'],
    async () => {
      const response = await postService.getPostById(id);
      return response;
    },
    {
      initialData: initialData,
      keepPreviousData: true,
      enabled: isEnable,
    }
  );
};

export const usePostsByTypeAndUserId = (params: IPostPaginationByTypeAndUserId) => {
  return useInfiniteQuery(
    ['posts_by_type_userId', params],
    async ({ pageParam = 0 }) => {
      params.pageNumber = pageParam;
      const response = await postService.getAllPostsByTypeAndUserId(params);
      return response;
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage) => {
        const maxPages = lastPage.data.pageable.totalPages;
        const nextPage = lastPage.data.pageable.pageNumber + 1;
        return nextPage < maxPages ? nextPage : undefined;
      },
    }
  );
};

export const usePostsByType = (params: IPostPaginationByType) => {
  return useInfiniteQuery(
    ['posts_by_type', params],
    async ({ pageParam = 0 }) => {
      params.pageNumber = pageParam;
      const response = await postService.getAllPostsByType(params);
      return response;
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage) => {
        const maxPages = lastPage.data.pageable.totalPages;
        const nextPage = lastPage.data.pageable.pageNumber + 1;
        return nextPage < maxPages ? nextPage : undefined;
      },
      // getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
    }
  );
};

export const usePosts = (params: IPaginationRequest | undefined) => {
  return useQuery(
    ['posts', params],
    async () => {
      const response = await postService.getAllPosts(params);
      return response;
    },
    {
      keepPreviousData: true,
    }
  );
};

// export const useTest = () => {
//   const { data, hasNextPage, fetchNextPage } = useInfiniteQuery(
//     ['tests'],
//     async () => {
//       const response = await postService.getAllPostsByType({
//         type: 'experience',
//         pageNumber: 0,
//         pageSize: 2,
//         sortBy: 'time',
//         sortType: 'DESC',
//       });
//       return response;
//     },
//     {
//       getNextPageParam: (lastPage: any, allPages: any) => {
//         const maxPages = lastPage.total_count / 30;
//         const nextPage = allPages.length + 1;
//         return nextPage <= maxPages ? nextPage : undefined;
//       },
//       getPreviousPageParam: (firstPage: any, pages) => firstPage.prevCursor,
//     }
//   );
// };
