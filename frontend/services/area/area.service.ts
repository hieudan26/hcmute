import { AxiosResponse } from 'axios';
import { async } from 'rxjs';
import { API_PATH } from '../../constants/api-path.constant';
import { AxiosResponseStatus } from '../../constants/global.constant';
import { ICountryRequest, IProvinceRequest } from '../../models/area/country.model';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';
import { getAsync, postAsync } from '../../utils/HttpClient.util';

class AreaService {
  createProvince = async (model: IProvinceRequest): Promise<AxiosResponseStatus<any>> => {
    var url = `areas/provinces`;
    return postAsync(url, model, 'Create successfully', false, true, true, undefined, undefined);
  };

  createCountry = async (model: ICountryRequest): Promise<AxiosResponseStatus<any>> => {
    var url = `areas/countries`;
    return postAsync(url, model, 'Create successfully', false, true, true, undefined, undefined);
  };

  getCountriesPagination = async (params: IPaginationRequest | undefined): Promise<AxiosResponseStatus<any>> => {
    var url = `areas/countries`;
    return getAsync(url, params, false, false, true);
  };

  getProvincesByCountryPagination = async (
    params: IPaginationRequest | undefined,
    idCountry: string
  ): Promise<AxiosResponseStatus<any>> => {
    var url = `${API_PATH.AREAS_COUNTRIES}/${idCountry}/provinces`;
    return getAsync(url, params, false, false, true);
  };

  getProvinces = async (params: IPaginationRequest | undefined): Promise<AxiosResponseStatus<any>> => {
    var url = `/areas/provinces`;
    return getAsync(url, params, false, false, true);
  };

  getCountries = async (): Promise<AxiosResponse<any>> => {
    var url = `${API_PATH.AREAS_LIST_COUNTRIES}?sortBy=enName&sortType=ASC`;
    return getAsync(url, undefined, false, false, false);
  };
  getProvincesByCountry = async (idCountry: string): Promise<AxiosResponse<any>> => {
    var url = `${API_PATH.AREAS_COUNTRIES}/${idCountry}/provinces?sortBy=name&sortType=ASC`;
    return getAsync(url, undefined, false, false, false);
  };
}

export default new AreaService();
