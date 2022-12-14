import { useInfiniteQuery } from '@tanstack/react-query';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';
import hashtagService from '../../services/hashtag/hashtag.service';

interface paginationhashTag {
  pagination: IPaginationRequest | undefined;
  hashTag: string | undefined;
}

interface paginationImagePostTypeHashTag {
  pagination: IPaginationRequest | undefined;
  hashTag: string;
  type: string;
}

export const useImagesHashTag = (params: paginationImagePostTypeHashTag, isEnable: boolean) => {
  return useInfiniteQuery(
    ['imagesHashTag', params],
    async ({ pageParam = 0 }) => {
      if (params.pagination) {
        params.pagination.pageNumber = pageParam;
      }
      const response = await hashtagService.getImages(params.pagination, params.hashTag, params.type);
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

export const useFindHashTag = (params: paginationhashTag, isEnable: boolean) => {
  return useInfiniteQuery(
    ['findHashTag', params],
    async ({ pageParam = 0 }) => {
      if (params.pagination) {
        params.pagination.pageNumber = pageParam;
      }
      const response = await hashtagService.findHashTag(params.pagination, params.hashTag);
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
