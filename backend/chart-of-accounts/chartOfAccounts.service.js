const db = require('../_helpers/db');
const ChartOfAccountsService = db.chartOfAccounts;
const ChartOfAccounts = db.chartOfAccounts;

module.exports = {
    getAll,
    createAccount,
    update
};

async function getAll() {
    return await ChartOfAccountsService.find({});
}

async function createAccount(userParam) {
    const chartOfAccounts = new ChartOfAccountsService();
    chartOfAccounts.accountNumber = userParam.accountNumber;
    chartOfAccounts.accountName = userParam.accountName;
    chartOfAccounts.accountDesc = userParam.accountDesc;
    chartOfAccounts.normalSide = userParam.normalSide;
    chartOfAccounts.accountType = userParam.accountType;
    chartOfAccounts.accountSubType = userParam.accountSubType;
    chartOfAccounts.accountBalance = userParam.accountBalance;
    chartOfAccounts.accountInitBalance = userParam.accountInitBalance;
    chartOfAccounts.accountTerm = userParam.accountTerm;
    chartOfAccounts.createdBy = userParam.createdBy;
    chartOfAccounts.createdDate = userParam.createdDate;
    chartOfAccounts.debit = userParam.debit;
    chartOfAccounts.credit = userParam.credit;
    chartOfAccounts.order = userParam.order;
    chartOfAccounts.comment = userParam.comment;
    chartOfAccounts.statement = userParam.statement;
    chartOfAccounts.accountActive = true;
    await chartOfAccounts.save();
}

async function update(id, userParam) {
    const account = await ChartOfAccounts.findById(id);
    // validate
    if (!account) throw 'ChartOfAccountsService not found';

    // copy userParam properties to user
    Object.assign(account, userParam);

    await account.save();
}
