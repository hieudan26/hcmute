import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';
import notificationService from '../../services/notification/notification.service';

export interface queryNotifications {
  isRead?: boolean;
  pagination: IPaginationRequest | undefined;
}

export interface readAllNotifications {
  listNotifications: string[] | undefined;
  status: boolean;
}

export const useCUDNotification = () => {
  const queryClient = useQueryClient();

  const mutationReadAllNotifications = useMutation(
    async (params: readAllNotifications) => {
      await notificationService.readAllNotifications(params.listNotifications, params.status);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['count_notifications']);
        queryClient.invalidateQueries(['notifications']);
      },
    }
  );

  return { mutationReadAllNotifications };
};

export const useCountNotifications = (isRead: boolean, initialData: any | undefined, isEnable: boolean) => {
  return useQuery(
    ['count_notifications'],
    async () => {
      const response = await notificationService.countNotifications(isRead);
      return response;
    },
    {
      initialData: initialData,
      keepPreviousData: true,
      enabled: isEnable,
    }
  );
};

export const useNotifications = (params: queryNotifications, isEnable: boolean) => {
  return useInfiniteQuery(
    ['notifications', params],
    async ({ pageParam = 0 }) => {
      if (params.pagination) {
        params.pagination.pageNumber = pageParam;
      }
      const response = await notificationService.getNotifications(params.pagination, params.isRead);
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
