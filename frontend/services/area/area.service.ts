import { AxiosResponse } from 'axios';
import { API_PATH } from '../../constants/api-path.constant';
import { getAsync } from '../../utils/HttpClient.util';

class AreaService {
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
