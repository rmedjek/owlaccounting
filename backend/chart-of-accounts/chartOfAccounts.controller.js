const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');
const accountService = require('./chartOfAccounts.service');
const ChartOfAccounts = db.chartOfAccounts;
const userService = require('../users/user.service');
const chartOfAccountService = require('./chartOfAccounts.service');

// routes
router.post('/createAccount', createAccount);
router.get('/', getAll);
router.put('/:id', update);
router.put('/:id', updateById);
router.delete('/:id', _delete);
router.get('/:id', findOne);
router.get('/:id/download', download);

module.exports = router;

function createAccount(req, res, next) {
    accountService.createAccount(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    const { page = 1, perPage = 10, filter, sortField, sortDir } = req.query;
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(perPage, 10),
        sort: {
            [sortField]: sortDir,
        }
    };
    const query = {};
    if (filter) {
        query.accountName = {
            $regex: filter,
        };
    }
    if (sortField && sortDir) {
        options.sort = {
            [sortField]: sortDir,
        };
    }
    ChartOfAccounts.paginate(query, options)
        .then(accounts => res.json(accounts))
        .catch(err => res.status(500).json(err));
}

function update(req, res, next) {
    accountService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    accountService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function findOne(req, res) {
    const { id } = req.params;
    accountService.findOne(id)
        .then( account => {
            if (!account) {
                return res.status(404).json({ err: 'Could not find any account' });
            }
            return res.json(account);
        }).catch(err => res.status(500).json(err));
}

function updateById(req, res) {
    const { id } = req.params;
    accountService.updateById(id)
        .then(account => res.json(account))
        .catch(err => res.status(500).json(err));
}


async function download(req, res) {
    try {
        const { id } = req.params;
        const account = await ChartOfAccounts.findById(id);
        if (!account) {
            return res.status(404).send({ err: 'could not find any account' });
        }
        const user = userService.getAll(req.currentUser);
        const templateBody = chartOfAccountService.getTemplateBody(account, user);
        const html = chartOfAccountService.getAccountTemplate(templateBody);
        await res.pdfFromHTML({
            filename: `${account.accountName}.pdf`,
            htmlContent: html,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send(err);
    }
}
