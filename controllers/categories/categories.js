const { getAllCategories, getCategoryId, insertCategory, modifyCategory, excludeCategory } = require('../../services/categories/categories');


function getCategories(req, res) {
    try {
        const categories = getAllCategories(req.params.idOwner);
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
        } else if (req.body.name && req.body.budget) {
            insertCategory(req.params.idOwner, req.body);
            res.status(201);
            res.send({ message: 'Categoria adicionada com sucesso!' });
        } else {
            res.status(422);
            res.send({ message: 'Campo name e budget é obrigatório.' });
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
        const existingName = getCategoryId(idOwner, id).id;

        if (existingName === id) {
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