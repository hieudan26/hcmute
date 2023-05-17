import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ITripRequestModel, ITripUpdateMemberModel, ITripDayUpdateRequestModel } from '../../models/trip/trip.model';
import tripService from '../../services/trip/trip.service';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';
import utilService from '../../services/util/util.service';

export interface IUpdateTripDays {
  tripId: number;
  params: ITripDayUpdateRequestModel[];
}

export interface ITrips {
  key: string | undefined;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortType: string;
  status: 'Private' | 'Public' | undefined;
  type: 'Plan' | 'Adventure' | undefined;
}

export interface ITripUpdate {
  id: number;
  params: ITripRequestModel;
}

export interface ITripMembers {
  tripId: number;
  key: string | undefined;
  params: IPaginationRequest;
}

export interface ITripUpdateMembers {
  tripId: number;
  members: ITripUpdateMemberModel[];
}

export interface ITripReview {
  idTrip: number;
  paramsPagination: IPaginationRequest;
}

export const useCUDTrip = () => {
  const queryClient = useQueryClient();

  const mutationUpdateTripDays = useMutation(
    async (params: IUpdateTripDays) => {
      return await tripService.updateTripDays(params.tripId, params.params);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['trip_by_id']);
      },
    }
  );

  const mutatuionUpdateTripMembers = useMutation(
    async (params: ITripUpdateMembers) => {
      return await tripService.updateTripMembers(params.tripId, params.members);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['trip_members']);
      },
    }
  );

  const mutationUpdateTrip = useMutation(
    async (params: ITripUpdate) => {
      return await tripService.updateTrip(params.id, params.params);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['trip_by_id']);
      },
    }
  );

  const mutationCreateTrip = useMutation(
    async (params: ITripRequestModel) => {
      return await tripService.createTrip(params);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
      },
    }
  );

  return { mutationCreateTrip, mutationUpdateTrip, mutatuionUpdateTripMembers, mutationUpdateTripDays };
};

export const useGetLatLon = (key: string, isEnable: boolean) => {
  return useQuery(
    ['lat_lon'],
    async () => {
      const response = await utilService.getLatLon(key);
      return response;
    },
    {
      keepPreviousData: true,
      enabled: isEnable,
    }
  );
};

export const useTripReviews = (params: ITripReview, isEnable: boolean) => {
  return useInfiniteQuery(
    ['trip_reviews', params],
    async ({ pageParam = 0 }) => {
      params.paramsPagination.pageNumber = pageParam;
      const response = await tripService.getReviewsTrip(params.idTrip, params.paramsPagination);
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

export const useTripMembers = (params: ITripMembers, isEnable: boolean) => {
  return useInfiniteQuery(
    ['trip_members', params],
    async ({ pageParam = 0 }) => {
      params.params.pageNumber = pageParam;
      const response = await tripService.getTripMembers(params.tripId, params.key, params.params);
      return response;
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage) => {
        const maxPages = lastPage.data.pageable.totalPages;
        const nextPage = lastPage.data.pageable.pageNumber + 1;
        return nextPage < maxPages ? nextPage : undefined;
      },
      enabled: isEnable,
    }
  );
};

export const useTripById = (id: string, initialData: any | undefined, isEnable: boolean) => {
  return useQuery(
    ['trip_by_id'],
    async () => {
      const response = await tripService.getTripById(Number(id));
      return response;
    },
    {
      initialData: initialData,
      keepPreviousData: true,
      enabled: isEnable,
    }
  );
};

export const useTrips = (params: ITrips) => {
  return useInfiniteQuery(
    ['trips', params],
    async ({ pageParam = 0 }) => {
      params.pageNumber = pageParam;
      const response = await tripService.getTrips(params);
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
