// Type for a successful pincode data response
export interface PincodeData {
  pincode: string;
  city: string;
  state: string;
  country: string;
  deliveryDays: number;
  deliveryDate: string;
  codAvailable: 1 | 0;
  serviceable: 1 | 0;
  extraInfo: string | null;
  lastUpdatedOn: string;
}


export interface PincodeError {
  error: string;
}


export type PincodeResponse = PincodeData | PincodeError | object;
