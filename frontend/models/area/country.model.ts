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
