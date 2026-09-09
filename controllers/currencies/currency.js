const { getAllCurrencies, getCurrencyById, getCurrenciesFilteredByName, insertCurrency, modifyCurrency, excludeCurrency, excludeCurrencies } = require('../../services/currencies/currency');

function getCurrencies(req, res) {
    try {
        res.send(getAllCurrencies(req.params.idOwner));
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function getCurrency(req, res) {
    try {
        const currencyExists = getCurrencyById(req.params.idOwner, req.params.id);

        if (currencyExists) {
            res.send(currencyExists);
        } else {
            res.status(422);
            res.send({ 'message': 'Cotação não encontrada.' });
        }
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function postCurrency(req, res) {
    try {
        if (getCurrencyById(req.params.idOwner, req.body.id)) {
            res.status(422);
            res.send({ 'message': 'Cotação já existe.' });
        } else if (
            req.body.idOwner &&
            req.body.quoteFor &&
            req.body.quoteFrom &&
            req.body.quotationValue
        ) {
            insertCurrency(req.params.idOwner, req.body);
            res.status(201);
            res.send({ 'message': 'Cotação adicionada com sucesso!' });
        } else {
            res.status(422);
            res.send({ 'message': 'Campos idOwner, quoteFor, quoteFrom e quotationValue são obrigatórios.' });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function patchCurrency(req, res) {
    try {
        const idOwner = req.params.idOwner;
        const id = req.params.id;
        const body = req.body;
        const currencyExisting = getCurrencyById(idOwner, id);

        if (currencyExisting) {
            modifyCurrency(body, idOwner, id);
            res.send({ 'message': 'Cotação modificada com sucesso!' });
        }
        else {
            res.status(422);
            res.send({ 'message': 'Cotação não encontrada.' });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function deleteCurrency(req, res) {
    if (req.params.IsNameOrId === 'name') {
        deleteCurrenciesByName(req.params.idOwner, req.params.nameOrId, res)
    } else if (req.params.IsNameOrId === 'id') {
        const reqId = req.params.nameOrId;
        try {
            if (getCurrencyById(req.params.idOwner, reqId)) {
                excludeCurrency(req.params.idOwner, reqId);
                res.send({ 'message': 'Cotação excluída com sucesso!' });
            } else {
                res.status(422);
                res.send({ 'message': 'Cotação não encontrada.' });
            }

        } catch (error) {
            res.status(500);
            res.send(error.message);
        }
    }
}

function deleteCurrenciesByName(idOwner, name, res) {
    const currenciesFilteredByName = getCurrenciesFilteredByName(idOwner, name)
    try {
        if (currenciesFilteredByName) {
            excludeCurrencies(currenciesFilteredByName);
            res.send({
                'message': `${currenciesFilteredByName.length} cotações contendo a moeda ${name} excluídas com sucesso!`
            });
        } else {
            res.status(422);
            res.send({ 'message': `Nenhuma cotação com o nome ${name} encontrada.` });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

module.exports = {
    getCurrencies,
    getCurrency,
    postCurrency,
    patchCurrency,
    deleteCurrency
}
