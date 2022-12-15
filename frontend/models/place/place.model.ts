export interface IPlaceCountryResponse {
  id: number;
  name: string;
  url: string;
  image: string;
  content: string;
  category: ICategoryResponse;
  hashTags: string[];
}

export interface ICategoryResponse {
  id: number;
  name: string;
  image: string | null;
}

export interface ICategoryRequest {
  name: string;
  image: string;
}

export interface ICategoryRequestUpdate extends ICategoryRequest {
  id: string;
}
