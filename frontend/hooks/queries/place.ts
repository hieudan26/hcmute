import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { async } from 'rxjs';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';
import placeService from '../../services/place/place.service';

export interface placesSpecification {
  pagination: IPaginationRequest | undefined;
  status: 'pending' | 'approved' | 'rejected' | undefined;
  type: string | undefined;
  userId: string | undefined;
}

export interface paginationUrlName {
  pagination: IPaginationRequest | undefined;
  urlName: string;
}

export interface IUrlsGetProvince {
  urlCountry: string;
  urlProvince: string;
}

export interface paginationGetPlaces {
  pagination: IPaginationRequest | undefined;
  urlCountry: string;
  urlProvince: string;
  type: string;
}

export interface IUrlsGetPlace {
  urlCountry: string;
  urlProvince: string;
  urlPlace: string;
}

export const useGetPlaceById = (id: string, isEnable: boolean) => {
  return useQuery(
    ['place_by_id'],
    async () => {
      const response = await placeService.getPlaceById(id);
      return response;
    },
    {
      keepPreviousData: true,
      enabled: isEnable,
    }
  );
};

export const useFetchPlacesSpecification_Pagination = (params: placesSpecification, isEnable: boolean) => {
  return useQuery(
    ['places_specification_pagination', params],
    async () => {
      const response = await placeService.getPlacesSpecification(params.pagination, params.status, params.type, params.userId);
      return response;
    },
    {
      keepPreviousData: true,
      enabled: isEnable,
    }
  );
};

export const useFetchPlacesSpecification_Infinite = (params: placesSpecification, isEnable: boolean) => {
  return useInfiniteQuery(
    ['places_specification_infinite', params],
    async ({ pageParam = 0 }) => {
      if (params.pagination) {
        params.pagination.pageNumber = pageParam;
      }
      const response = await placeService.getPlacesSpecification(params.pagination, params.status, params.type, params.userId);
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

export const useFetchPlace = (params: IUrlsGetPlace, isEnable: boolean) => {
  return useQuery(
    ['places_place', params],
    async () => {
      const response = await placeService.getPlace(params.urlCountry, params.urlProvince, params.urlPlace);
      return response;
    },
    {
      keepPreviousData: true,
      enabled: isEnable,
    }
  );
};

export const usePlacesPlacesByCountryProvince = (params: paginationGetPlaces, isEnable: boolean) => {
  return useInfiniteQuery(
    ['places_places_by_country_province', params],
    async ({ pageParam = 0 }) => {
      if (params.pagination) {
        params.pagination.pageNumber = pageParam;
      }
      const response = await placeService.getPlaces(params.pagination, params.urlCountry, params.urlProvince, params.type);
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

export const useFetchCategories = (params: IPaginationRequest | undefined, isEnable: boolean) => {
  return useQuery(
    ['places_categories', params],
    async () => {
      const response = await placeService.getCategories(params);
      return response;
    },
    {
      keepPreviousData: true,
      enabled: isEnable,
    }
  );
};

export const useFetchProvince = (params: IUrlsGetProvince, isEnable: boolean) => {
  return useQuery(
    ['places_province', params],
    async () => {
      const response = await placeService.getProvinceByCountry(params.urlCountry, params.urlProvince);
      return response;
    },
    {
      keepPreviousData: true,
      enabled: isEnable,
    }
  );
};

export const useFetchCountry = (urlName: string, isEnable: boolean) => {
  return useQuery(
    ['places_country', urlName],
    async () => {
      const response = await placeService.getCountry(urlName);
      return response;
    },
    {
      keepPreviousData: true,
      enabled: isEnable,
    }
  );
};

export const usePlacesProvincesByCountry = (params: paginationUrlName, isEnable: boolean) => {
  return useInfiniteQuery(
    ['places_provinces_by_country', params],
    async ({ pageParam = 0 }) => {
      if (params.pagination) {
        params.pagination.pageNumber = pageParam;
      }
      const response = await placeService.getProvincesByCountry(params.pagination, params.urlName);
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

export const usePlacesCountries_Query = (params: IPaginationRequest | undefined, isEnable: boolean) => {
  return useQuery(
    ['places_countries_query'],
    async () => {
      const response = await placeService.getCountries(params);
      return response;
    },
    {
      keepPreviousData: true,
      enabled: isEnable,
    }
  );
};

export const usePlacesCountries = (params: IPaginationRequest) => {
  return useInfiniteQuery(
    ['places_countries', params],
    async ({ pageParam = 0 }) => {
      params.pageNumber = pageParam;
      const response = await placeService.getCountries(params);
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
