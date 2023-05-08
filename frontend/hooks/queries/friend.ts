import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  IFriendRequest,
  IQueryGetFriendByUserAndStatus,
  IQueryGetFriendByUserAndStatusAndSearch,
} from '../../models/user/user.model';
import userService from '../../services/user/user.service';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';

export interface IUsersParams {
  paging: IPaginationRequest;
  searchFirstName: string | undefined;
  searchLastName: string | undefined;
}

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
        queryClient.invalidateQueries(['advice_friends']);
      },
    }
  );

  return { mutationUpdateStatusFriends };
};

export const useUsers = (params: IUsersParams, isEnable: boolean) => {
  return useInfiniteQuery(
    ['users', params],
    async ({ pageParam = 0 }) => {
      params.paging.pageNumber = pageParam;
      const response = await userService.getUsers(params.paging, params.searchFirstName, params.searchLastName);
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

export const useAdviceFriends = (params: IPaginationRequest, isEnable: boolean) => {
  return useInfiniteQuery(
    ['advice_friends', params],
    async ({ pageParam = 0 }) => {
      params.pageNumber = pageParam;
      const response = await userService.getAdviceFriends(params);
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

export const useFriends = (params: IQueryGetFriendByUserAndStatusAndSearch, isEnable: boolean) => {
  return useInfiniteQuery(
    ['friends', params],
    async ({ pageParam = 0 }) => {
      const { userId, status, key, ...paramsNormal } = params;
      paramsNormal.pageNumber = pageParam;
      const response = await userService.getUserFriends(key, userId, status, paramsNormal);
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
