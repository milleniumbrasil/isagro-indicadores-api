export interface IReportQueryDTO {
  country: string;
  state: string;
  city: string;
  source: string;
  period: any;
  label: string;
  value: number;
  external_id: string;
  analysis: string;
}

export interface IReportPersistDTO {
  country: string;
  state: string;
  city: string;
  source: string;
  period: any;
  label: string;
  value: number;
  external_id: string;
  analysis: string;
}