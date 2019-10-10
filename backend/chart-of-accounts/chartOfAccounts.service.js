const db = require('../_helpers/db');
const ChartOfAccounts = db.chartOfAccounts;
const ChartOfAccountsService = db.chartOfAccounts;

module.exports = {
    getAll,
    createAccount,
    update,
    findOne,
    updateById,
    delete: _delete,
    getTemplateBody,
    getAccountTemplate: getAccountTemplate,
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
    chartOfAccounts.accountOrder = userParam.accountOrder   ;
    chartOfAccounts.comment = userParam.comment;
    chartOfAccounts.statement = userParam.statement;
    chartOfAccounts.accountActive = true;
    await chartOfAccounts.save();
}

async function _delete(id) {
    return await ChartOfAccounts.findByIdAndRemove(id);
}

async function findOne(id) {
   return  await ChartOfAccounts.findById(id);
}

async function updateById(id) {
    return  await ChartOfAccounts.findOneAndUpdate(id);
}

async function update(id, userParam) {
    const account = await ChartOfAccounts.findById(id);
    // validate
    if (!account) throw 'ChartOfAccountsService not found';

    // copy userParam properties to user
    Object.assign(account, userParam);

    await account.save();
}

function getTemplateBody(account) {
    return `
    <div class="container">
  <div class="row">
      <div class="col-xs-2">
      </div>
      <div class="col-xs-4 text-center">
          <h1>Owl Accounting</h1>
          <h1>
              <small> ${account.accountName}</small>
          </h1>
      </div>
  </div>
 <table>
            <tr>
                <td>Account#: </td>
                <td> ${account.accountNumber}</td>
            </tr>
            <tr>
                <td>Account Name: </td>
                <td>${account.accountName}</td>
            </tr>
            <tr>
                <td>Account Description: </td>
                <td>${account.accountDesc}</td>
            </tr>
            <tr>
                <td>Account Type: </td>
                <td>${account.accountType}</td>
            </tr>
            <tr>
                <td>Account subtype: </td>
                <td>${account.accountSubType}</td>
            </tr>

            <tr>
                <td>Account side: </td>
                <td>${account.normalSide}</td>
            </tr>
            <tr>
                <td>Account balance: </td>
                <td>$${account.accountBalance}</td>
            </tr>
            <tr>
                <td>Account init balance: </td>
                <td> $${account.accountInitBalance}</td>
            </tr>
            <tr>
                <td>Created by: </td>
                <td>${account.createdBy}</td>
            </tr>
            <tr>
                <td>Created On: </td>
                <td> ${account.createdDate}</td>
            </tr>
            <tr>
                <td>debit: </td>
                <td>$${account.debit}</td>
            </tr>
            <tr>
                <td>credit: </td>
                <td> $${account.credit}</td>
            </tr>
            <tr>
                <td>Active: </td>
                <td>${account.accountActive}</td>
            </tr>
            <tr>
                <td>statement: </td>
                <td>${account.statement}</td>
            </tr>
            <tr>
                <td>comment: </td>
                <td>${account.comment}</td>
            </tr>
        </table>
</div>`;
}

function getAccountTemplate(templateBody) {
    const html = `
    <html>
    <head>
    <title> The Account Chart </title>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
     <style>
     @import url(http://fonts.googleapis.com/css?family=Bree+Serif);
     body, h1, h2, h3, h8, h5, h6{
     font-family: 'Bree Serif', serif;
     }
     </style>
    </head>

    <body>
       ${templateBody}
    </body>
    </html>
    `;
    return html;
}

