const { getAllSourceExpense, getSourceExpenseByDescription, insertSourceExpense, modifySourceExpense, excludeSourceExpense } = require('../../services/sourceExpenses/sourceExpense');

const { getTotalCurrentMonth } = require('../../services/sourceExpenses/sourceExpenseCalculations');


function getSourceExpenses(req, res) {
    try {
        res.send(getAllSourceExpense(req.params.idOwner));
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function getSourceExpense(req, res) {
    try {
        const expenseExists = getSourceExpenseByDescription(
            req.params.idOwner, req.params.id
        );

        if (expenseExists) {
            res.send(expenseExists);
        } else {
            res.status(422);
            res.send({ message: 'Fonte de gasto não encontrada.' });
        }
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function getCurrentMonthValue(req, res) {
    try {
        if (getTotalCurrentMonth(req.params.idOwner)) {
            res.send({
                value: getTotalCurrentMonth(req.params.idOwner)
            });
        } else {
            res.status(422);
            res.send({ message: 'Não foi possível calcular.' });
        }
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function postSourceExpense(req, res) {
    try {
        if (getSourceExpenseByDescription(req.params.idOwner, req.body.id)) {
            res.status(422)
            res.send({ message: 'Fonte de gasto já existe.' });
        } else if (req.body.description && req.body.valueExpense) {
            insertSourceExpense(req.params.idOwner, req.body);
            res.status(201);
            res.send({ message: 'Fonte de gasto adicionada com sucesso!' });
        } else {
            res.status(422);
            res.send({ message: 'Campos description e valueExpense são obrigatórios.' });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function patchSourceExpense(req, res) {
    try {
        const idOwner = req.params.idOwner;
        const id = req.params.id;
        const body = req.body;
        const descriptionExists = getSourceExpenseByDescription(idOwner, id).id;

        if (descriptionExists === id) {
            modifySourceExpense(body, idOwner, id);
            res.send({ message: 'Fonte de gasto editada com sucesso!' });
        }
        else {
            res.status(422);
            res.send({ message: 'Fonte de gasto não encontrada.' });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function deleteSourceExpense(req, res) {
    try {
        if (getSourceExpenseByDescription(req.params.idOwner, req.params.id)) {
            excludeSourceExpense(req.params.idOwner, req.params.id);
            res.send({ message: 'Fonte de gasto excluída com sucesso!' });
        } else {
            res.status(422);
            res.send({ message: 'Fonte de gasto não encontrada.' });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

module.exports = {
    getSourceExpenses,
    getCurrentMonthValue,
    getSourceExpense,
    postSourceExpense,
    patchSourceExpense,
    deleteSourceExpense
}
