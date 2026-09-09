const { getAllEntries, getEntryById, insertEntry, modifyEntry, excludeEntry } = require('../../services/entries/entries');

function getEntries(req, res) {
    try {
        res.send(getAllEntries(req.params.idOwner));
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function getEntry(req, res) {
    try {
        const entryExists = getEntryById(req.params.idOwner, req.params.id);

        if (entryExists) {
            res.send(entryExists);
        } else {
            res.status(422);
            res.send({ message: 'Lançamento não encontrado.' });
        }
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function postEntry(req, res) {
    try {
        if (getEntryById(req.params.idOwner, req.body.id)) {
            res.status(422);
            res.send({ message: 'Id já existe.' });
        } else if (req.body.payer && req.body.date && req.body.value && req.body.description) {
            insertEntry(req.params.idOwner, req.body);
            res.status(201);
            res.send({ message: 'Lançamento de entrada adicionado com sucesso!' });
        } else {
            res.status(422);
            res.send({ message: 'Campos payer, date, value e description são obrigatórios.' });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function patchEntry(req, res) {
    try {
        const idOwner = req.params.idOwner;
        const id = req.params.id;
        const body = req.body;
        const idExisting = getEntryById(idOwner, id).id;

        if (idExisting === id) {
            modifyEntry(body, idOwner, id);
            res.send({ message: 'Item modificado com sucesso!' });
        }
        else {
            res.status(422);
            res.send({ message: 'Lançamento de entrada não encontrado.' });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function deleteEntry(req, res) {
    try {
        if (getEntryById(req.params.idOwner, req.params.id)) {
            excludeEntry(req.params.idOwner, req.params.id);
            res.send({ message: 'Lançamento de entrada excluído com sucesso!' });
        } else {
            res.status(422);
            res.send({ message: 'Lançamento de entrada não encontrado.' });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

module.exports = {
    getEntries,
    getEntry,
    postEntry,
    patchEntry,
    deleteEntry
}
