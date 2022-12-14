import { async } from 'rxjs';
import { AxiosResponseStatus } from '../../constants/global.constant';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';
import { getAsync } from '../../utils/HttpClient.util';

class PlaceService {
  getPlace = async (urlCountry: string, urlProvince: string, urlPlace: string): Promise<AxiosResponseStatus<any>> => {
    var url = `places/countries/${urlCountry}/provinces/${urlProvince}/places/${urlPlace}`;
    return getAsync(url, undefined, false, false, true);
  };

  getPlaces = async (
    params: IPaginationRequest | undefined,
    urlCountry: string,
    urlProvince: string,
    type: string
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
