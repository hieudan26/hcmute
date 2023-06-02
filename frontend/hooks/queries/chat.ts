import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';
import chatService from '../../services/chat/chat.service';
import { IRoomRequest } from '../../models/chat/chat.model';

export interface IUseMessages {
  pagination: IPaginationRequest;
  roomId: string | number;
}

export interface IChatUpdate extends IRoomRequest {
  roomId: string;
}

export interface IKickMember {
  roomId: string;
  userId: string;
}

export const useCUDChat = () => {
  const queryClient = useQueryClient();

  const mutationDeleteRoom = useMutation(
    async (roomId: string) => {
      return await chatService.deleteRoom(roomId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['chats']);
      },
    }
  );

  const mutationLeaveRoom = useMutation(
    async (roomId: string) => {
      return await chatService.leaveRoom(roomId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['chats']);
      },
    }
  );

  const mutationKickMember = useMutation(
    async (params: IKickMember) => {
      return await chatService.removeMemberInRoom(params.roomId, params.userId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['room']);
        queryClient.invalidateQueries(['chats']);
      },
    }
  );

  const mutationUpdateChat = useMutation(
    async (params: IChatUpdate) => {
      let { roomId, ...rparams } = params;
      return await chatService.updateRoom(rparams, roomId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['room']);
        queryClient.invalidateQueries(['chats']);
      },
    }
  );

  return { mutationUpdateChat, mutationKickMember, mutationLeaveRoom, mutationDeleteRoom };
};

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

interface useChats {
  params: IPaginationRequest;
  type: string;
}

export const useChats = (params: useChats, isEnable: boolean) => {
  return useInfiniteQuery(
    ['chats', params],
    async ({ pageParam = 0 }) => {
      let paramsTemp = { ...params };
      paramsTemp.params.pageNumber = pageParam;
      const response = await chatService.getRooms(paramsTemp.params, paramsTemp.type);
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
