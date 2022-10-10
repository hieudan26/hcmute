import { AxiosResponse } from 'axios';
import { Country } from '../../models/common/Location.model';
import { getAsync } from '../../utils/HttpClient.util';

class UtilService {
  getAllCountriesAsync = async (): Promise<AxiosResponse<Country>> => {
    var url = 'https://api.covid19api.com/countries';
    return await getAsync(url, undefined, false, false, false);
  };
}

export default new UtilService();
