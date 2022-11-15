import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IFriendRequest, IQueryGetFriendByUserAndStatus } from '../../models/user/user.model';
import userService from '../../services/user/user.service';

export const useCUDFriends = () => {
  const queryClient = useQueryClient();

  const mutationUpdateStatusFriends = useMutation(
    async (params: IFriendRequest) => {
      const { userId, ...normalParams } = params;
      const uId = userId ? userId : '86ce8572-3c92-4cca-89e3-060c35e613be';
      await userService.updateStatusFriends(uId, normalParams);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['friends']);
      },
    }
  );

  return { mutationUpdateStatusFriends };
};

export const useFriends = (params: IQueryGetFriendByUserAndStatus, isEnable: boolean) => {
  return useInfiniteQuery(
    ['friends', params],
    async ({ pageParam = 0 }) => {
      const { userId, status, ...paramsNormal } = params;
      paramsNormal.pageNumber = pageParam;
      const response = await userService.getUserFriends(userId, status, paramsNormal);
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
