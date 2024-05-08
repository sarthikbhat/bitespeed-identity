export interface IRequestBody {
  email: string;
  phoneNumber: string;
}

export interface IResponse {
  primaryContatctId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}
