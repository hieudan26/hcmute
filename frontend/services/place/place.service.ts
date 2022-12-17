import { Dispatch, SetStateAction } from 'react';
import { async } from 'rxjs';
import { AxiosResponseStatus } from '../../constants/global.constant';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';
import { ICategoryRequest, ICategoryRequestUpdate, IPlaceRequest, IPlaceRequestUpdate } from '../../models/place/place.model';
import { getAsync, postAsync, putAsync } from '../../utils/HttpClient.util';

class PlaceService {
  updatePlace = async (
    params: IPlaceRequestUpdate,
    url: string,
    setSubmitting: Dispatch<SetStateAction<boolean>> | undefined
  ): Promise<AxiosResponseStatus<any>> => {
    var url = `/places/${url}`;
    return putAsync(url, params, 'Update place successfully', false, true, true, undefined, setSubmitting);
  };

  createPlace = async (
    params: IPlaceRequest,
    setSubmitting: Dispatch<SetStateAction<boolean>> | undefined
  ): Promise<AxiosResponseStatus<any>> => {
    var url = `/places/`;
    return postAsync(url, params, 'Create place successfully', false, true, true, undefined, setSubmitting);
  };

  updateCategory = async (
    params: ICategoryRequestUpdate,
    setSubmitting: Dispatch<SetStateAction<boolean>> | undefined
  ): Promise<AxiosResponseStatus<any>> => {
    var url = `/places/categories/${params.id}`;
    const mainParams: ICategoryRequest = { image: params.image, name: params.name };
    return putAsync(url, mainParams, 'Update category successfully', false, true, true, undefined, setSubmitting);
  };

  createCategory = async (
    params: ICategoryRequest,
    setSubmitting: Dispatch<SetStateAction<boolean>> | undefined
  ): Promise<AxiosResponseStatus<any>> => {
    var url = `/places/categories`;
    return postAsync(url, params, 'Create category successfully', false, true, true, undefined, setSubmitting);
  };

  getPlace = async (urlCountry: string, urlProvince: string, urlPlace: string): Promise<AxiosResponseStatus<any>> => {
    var url = `places/countries/${urlCountry}/provinces/${urlProvince}/places/${urlPlace}`;
    return getAsync(url, undefined, false, false, true);
  };

  getPlaces = async (
    params: IPaginationRequest | undefined,
    urlCountry: string,
    urlProvince: string,
    type: string | undefined
  ): Promise<AxiosResponseStatus<any>> => {
    var url = `places/countries/${urlCountry}/provinces/${urlProvince}/places`;
    var mainParams = { ...params, type: type };
    return getAsync(url, mainParams, false, false, true);
  };

  getCategories = async (params: IPaginationRequest | undefined): Promise<AxiosResponseStatus<any>> => {
    var url = `places/categories`;
    return getAsync(url, params, false, false, true);
  };

  getProvinceByCountry = async (urlCountry: string, urlProvince: string): Promise<AxiosResponseStatus<any>> => {
    var url = `places/countries/${urlCountry}/provinces/${urlProvince}`;
    return getAsync(url, undefined, false, false, true);
  };

  getCountry = async (urlName: string): Promise<AxiosResponseStatus<any>> => {
    var url = `places/countries/${urlName}`;
    return getAsync(url, undefined, false, false, true);
  };

  getProvincesByCountry = async (params: IPaginationRequest | undefined, urlName: string): Promise<AxiosResponseStatus<any>> => {
    var url = `places/countries/${urlName}/provinces`;
    return getAsync(url, params, false, false, true);
  };

  getCountries = async (params: IPaginationRequest | undefined): Promise<AxiosResponseStatus<any>> => {
    var url = `places/countries`;
    return getAsync(url, params, false, false, true);
  };
}

export default new PlaceService();
