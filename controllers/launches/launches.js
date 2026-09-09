const { getAllLaunches, getLaunchesByMonth, getLaunchById, insertLaunch, modifyLaunch, excludeLaunch } = require('../../services/launches/launches');
const { getAllCategories } = require('../../services/categories/categories');


function getLaunches(req, res) {
    try {
        res.send(getAllLaunches(req.params.idOwner));
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function getLaunchesMonth(req, res) {
    try {
        res.send(getLaunchesByMonth(req.params.monthNumber, req.params.idOwner));
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function getLaunch(req, res) {
    try {
        const launchExists = getLaunchById(req.params.idOwner, req.params.id);

        if (launchExists) {
            res.send(launchExists);
        } else {
            res.status(422);
            res.send({ message: 'Lançamento não encontrado.' });
        }
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function postLaunch(req, res) {
    try {
        if (getLaunchById(req.params.idOwner, req.body.id)) {
            res.status(422);
            res.send({ message: 'Id já existe.' });
        } else if (req.body.categoryName && req.body.categoryId && req.body.date && req.body.value && req.body.description) {
            const categoryExists = getAllCategories(req.params.idOwner).some(category => category.id === req.body.categoryId);

            if (!categoryExists) {
                res.status(422);
                res.send({ message: 'Categoria informada não encontrada.' });
                return;
            }

            insertLaunch(req.params.idOwner, req.body);
            res.status(201);
            res.send({ message: 'Lançamento de gasto adicionado com sucesso!' });
        } else {
            res.status(422);
            res.send({ message: 'Campos categoryName, categoryId, date, value e description são obrigatórios.' });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function patchLaunch(req, res) {
    try {
        const idOwner = req.params.idOwner;
        const id = req.params.id;
        const body = req.body;
        const idExisting = getLaunchById(idOwner, id).id;

        if (idExisting === id) {
            modifyLaunch(body, idOwner, id);
            res.send({ message: 'Item modificado com sucesso!' });
        }
        else {
            res.status(422);
            res.send({ message: 'Lançamento de gasto não encontrado.' });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function deleteLaunch(req, res) {
    try {
        if (getLaunchById(req.params.idOwner, req.params.id)) {
            excludeLaunch(req.params.idOwner, req.params.id);
            res.send({ message: 'Lançamento de gasto excluído com sucesso!' });
        } else {
            res.status(422);
            res.send({ message: 'Lançamento de gasto não encontrado.' });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

module.exports = {
    getLaunches,
    getLaunchesMonth,
    getLaunch,
    postLaunch,
    patchLaunch,
    deleteLaunch
}
