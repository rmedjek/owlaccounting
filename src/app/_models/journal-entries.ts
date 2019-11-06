export class JournalEntry {
    id: string;
    type: string;
    createdBy: string;
    accountDebit: string[];
    accountCredit: string[];
    amountDebit: number[];
    amountCredit: number[];
    description: string;
    createdDate: Date;
    status: string;
    declineReason: string;
    imageData: string;
    imageName: string;
    imageType: string;
    journalId: number;
}
