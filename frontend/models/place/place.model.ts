export interface IPlaceCountryResponse {
  id: number;
  name: string;
  url: string;
  image: string;
  content: string;
  category: ICategoryResponse;
  hashTags: string[];
  description: string;
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

export interface IPlaceRequest {
  area: number;
  category: number;
  content: string;
  description: string;
  hashTags: string[];
  image: string;
  name: string;
  status?: string;
  statusDescription?: string;
}

export interface IPlaceRequestUpdate {
  category: number;
  content: string;
  description: string;
  hashTags: string[];
  image: string;
  name: string;
}
