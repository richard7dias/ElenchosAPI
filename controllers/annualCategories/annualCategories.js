const { getAllAnnualCategories, getCategoryId, insertCategory, modifyCategory, excludeCategory } = require('../../services/annualCategories/annualCategories');


function getCategories(req, res) {
    try {
        const categories = getAllAnnualCategories(req.params.idOwner);
        res.send(categories);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function getCategory(req, res) {
    try {
        const idOwner = req.params.idOwner;
        const id = req.params.id;
        const categoryExists = getCategoryId(idOwner, id);

        if (categoryExists) {
            res.send(categoryExists);
        } else {
            res.status(422);
            res.send({ message: 'Categoria não encontrada.' });
        }
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function postCategory(req, res) {
    try {
        if (getCategoryId(req.params.idOwner, req.body.id)) {
            res.status(422)
            res.send({ message: 'Categoria já existe.' });
        } else if (
            req.body.description &&
            typeof req.body.value !== 'undefined' &&
            (req.body.automaticDebit === true || req.body.automaticDebit === false) &&
            typeof req.body.monthOfPayment !== 'undefined' &&
            req.body.monthOfPayment >= 1 && req.body.monthOfPayment <= 12
        ) {
            insertCategory(req.params.idOwner, req.body);
            res.status(201);
            res.send({ message: 'Categoria adicionada com sucesso!' });
        } else {
            res.status(422);
            res.send({ message: 'Campo description, value, automaticDebit e monthOfPayment são obrigatórios.' });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function patchCategory(req, res) {
    try {
        const idOwner = req.params.idOwner;
        const id = req.params.id;
        const body = req.body;
        const existingCategory = getCategoryId(idOwner, id).id;

        if (existingCategory === id) {
            modifyCategory(body, idOwner, id);
            res.send({ message: 'Item modificado com sucesso!' });
        }
        else {
            res.status(422);
            res.send({ message: 'Categoria não encontrada.' });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function deleteCategory(req, res) {
    try {
        if (getCategoryId(req.params.idOwner, req.params.id)) {
            excludeCategory(req.params.idOwner, req.params.id);
            res.send({ message: 'Categoria excluída com sucesso!' });
        } else {
            res.status(422);
            res.send({ message: 'Categoria não encontrada.' });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

module.exports = {
    getCategories,
    getCategory,
    postCategory,
    patchCategory,
    deleteCategory
}