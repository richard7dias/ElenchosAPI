const { getAllBalances, getBalancePerId, insertBalance, modifyBalance, excludeBalance } = require('../../services/balances/balances');

function getBalances(req, res) {
    try {
        res.send(getAllBalances(req.params.idOwner));
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function getBalance(req, res) {
    try {
        const balanceExists = getBalancePerId(req.params.idOwner, req.params.id);

        if (balanceExists) {
            res.send(balanceExists);
        } else {
            res.status(422);
            res.send({ message: 'Conta não encontrada.' });
        }
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function postBalance(req, res) {
    try {
        if (getBalancePerId(req.params.idOwner, req.body.id)) {
            res.status(422);
            res.send({ message: 'Conta já existe.' });
        } else if (req.body.account && req.body.valueBalance) {
            insertBalance(req.params.idOwner, req.body);
            res.status(201);
            res.send({ message: 'Conta adicionada com sucesso!' });
        } else {
            res.status(422);
            res.send({ message: 'Campos account e valueBalance são obrigatórios.' });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function patchBalance(req, res) {
    try {
        const idOwner = req.params.idOwner;
        const id = req.params.id;
        const body = req.body;
        const accountExisting = getBalancePerId(idOwner, id).id;

        if (accountExisting === id) {
            modifyBalance(body, idOwner, id);
            res.send({ message: 'Conta modificada com sucesso!' });
        }
        else {
            res.status(422);
            res.send({ message: 'Conta não encontrada.' });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function deleteBalance(req, res) {
    try {
        if (getBalancePerId(req.params.idOwner, req.params.id)) {
            excludeBalance(req.params.idOwner, req.params.id);
            res.send({ message: 'Conta excluída com sucesso!' });
        } else {
            res.status(422);
            res.send({ message: 'Conta não encontrada.' });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

module.exports = {
    getBalances,
    getBalance,
    postBalance,
    patchBalance,
    deleteBalance
}
