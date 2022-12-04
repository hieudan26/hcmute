export interface ICountryModel {
  createdBy: string | null | undefined;
  creationDate: string | Date | null | undefined;
  disable: boolean;
  enName: string;
  id: number;
  lastModifiedDate: string | Date | null | undefined;
  modifiedBy: string | null | undefined;
  name: string;
  provinces: any[];
}

export interface IProvinceModel {
  createdBy: string | null | undefined;
  creationDate: string | Date | null | undefined;
  disable: boolean;
  id: number;
  lastModifiedDate: string | Date | null | undefined;
  modifiedBy: string | null | undefined;
  name: string;
}

export interface ICountryResponse {
  creationDate: string | null;
  lastModifiedDate: string | null;
  createdBy: string | null;
  modifiedBy: string | null;
  id: number;
  name: string;
  enName: string;
  type: string;
  parentId: number | null;
  disable: boolean;
}

export interface IProvinceResponse extends ICountryResponse {}

export interface ICountryRequest {
  enName: string;
  name: string;
}

export interface IProvinceRequest extends ICountryRequest {
  parentId: number;
}
