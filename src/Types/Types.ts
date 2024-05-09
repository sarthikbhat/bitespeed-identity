export interface IRequestBody {
  email: string;
  phoneNumber: string;
}

export class ConsolidatedContact  {
  primaryContatctId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];

  constructor() {
    this.primaryContatctId = 0;
    this.emails = [];
    this.phoneNumbers = [];
    this.secondaryContactIds = [];
  }
}

export interface IResponse {
  contact: ConsolidatedContact;
}
