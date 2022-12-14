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
