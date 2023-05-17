import { AxiosResponse } from 'axios';
import { Country } from '../../models/common/Location.model';
import { getAsync } from '../../utils/HttpClient.util';
import { AxiosResponseStatus } from '../../constants/global.constant';

class UtilService {
  getLatLon = async (key: string): Promise<AxiosResponseStatus<any>> => {
    var url = `https://nominatim.openstreetmap.org/search?q=${key}&format=json&limit=1`;
    return await getAsync(url, undefined, false, false, true);
  };

  getAllCountriesAsync = async (): Promise<AxiosResponse<Country>> => {
    var url = 'https://api.covid19api.com/countries';
    return await getAsync(url, undefined, false, false, false);
  };
}

export default new UtilService();
