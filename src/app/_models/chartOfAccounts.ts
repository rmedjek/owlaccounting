export class ChartOfAccounts {
  _id: string;
  accountNumber: number;
  accountName: string;
  accountDesc: string;
  accountType: string;
  accountSubType: string;
  normalSide: string;
  accountTerm: string;
  accountBalance: number;
  accountInitBalance: number;
  accountOrder: number;
  createdBy: string;
  createdDate: Date;
  debit: number;
  credit: number;
  accountActive: boolean;
  statement: string;
  comment: string;
}

export class AccountPaginationResponse {
  docs: ChartOfAccounts[];
  total: number;
  pages: number;
  page: number;
  limit: number;
}
