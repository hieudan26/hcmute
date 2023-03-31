import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';
import chatService from '../../services/chat/chat.service';

export interface IUseMessages {
  pagination: IPaginationRequest;
  roomId: string | number;
}

export const useMessages = (params: IUseMessages, isEnable: boolean) => {
  return useInfiniteQuery(
    ['messages', params],
    async ({ pageParam = 0 }) => {
      params.pagination.pageNumber = pageParam;
      const response = await chatService.getMessages(params.pagination, params.roomId);
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

export const useRoom = (roomId: string, isEnable: boolean) => {
  return useQuery(
    ['room', roomId],
    async () => {
      const response = await chatService.getRoom(roomId);
      return response;
    },
    {
      keepPreviousData: true,
      enabled: isEnable,
    }
  );
};

export const useChats = (params: IPaginationRequest | undefined, isEnable: boolean) => {
  return useInfiniteQuery(
    ['chats', params],
    async ({ pageParam = 0 }) => {
      let paramsTemp = { ...pageParam };
      if (params && params.pageNumber) {
        paramsTemp.pageNumber = pageParam;
      }
      const response = await chatService.getRooms(paramsTemp);
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
