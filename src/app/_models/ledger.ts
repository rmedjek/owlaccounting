export class Ledger {
    id: string;
    journalId: string;
    accountDebit: boolean;
    accountName: string;
    entryType: string;
    amount: number;
    description: string;
    createdDate: Date;
    accountType: string;
}
