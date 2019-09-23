const db = require('../_helpers/db');
const ChartOfAccountsService = db.chartOfAccounts;
const Account = db.chartOfAccounts;

module.exports = {
    getAll,
    createAccount,
    update
};

async function getAll() {
    return await ChartOfAccountsService.find({});
}

async function createAccount(userParam) {
    const Account = new ChartOfAccountsService();
    Account.accountNumber = userParam.accountNumber;
    Account.accountName = userParam.accountName;
    Account.accountType = userParam.accountType;
    Account.accountSubType = userParam.accountSubType;
    Account.accountBalance = userParam.accountBalance;
    Account.accountTerm = userParam.accountTerm;
    Account.createdBy = userParam.createdBy;
    Account.createdDate = userParam.createdDate;
    Account.accountDesc = userParam.accountDesc;
    Account.accountInitBalance = userParam.accountInitBalance;
    Account.accountActive = true;
    await Account.save();
}

async function update(id, userParam) {
    const account = await Account.findById(id);
    // validate
    if (!account) throw 'Account not found';

    // copy userParam properties to user
    Object.assign(account, userParam);

    await account.save();
}
