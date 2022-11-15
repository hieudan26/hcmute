import { useInfiniteQuery } from '@tanstack/react-query';
import { IQueryGetFriendByUserAndStatus } from '../../models/user/user.model';
import userService from '../../services/user/user.service';

export const useImages = (params: IQueryGetFriendByUserAndStatus, isEnable: boolean) => {
  return useInfiniteQuery(
    ['images', params],
    async ({ pageParam = 0 }) => {
      const { userId, ...paramsNormal } = params;
      paramsNormal.pageNumber = pageParam;
      const response = await userService.getUserImages(userId, paramsNormal);
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
