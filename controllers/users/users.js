const { getAllUsers, getUserById, activeUser, getUserNotActiveByEmail, getUserActiveByEmail, getUserForLogin, insertUser, modifyUser, excludeUser } = require('../../services/users/users');


function getUsers(req, res) {
    try {
        res.send(getAllUsers());
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function getUserLogin(req, res) {
    try {
        const userExists = getUserForLogin(req.params.email, req.params.password);

        if (userExists) {
            res.send(userExists);
        } else if (getUserActiveByEmail(req.params.email)) {
            res.status(422);
            res.send({
                'message': 'Senha incorreta.'
            });
        } else {
            res.status(422);
            res.send({
                'message': 'Usuário não encontrado.'
            });
        }
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function getUser(req, res) {
    try {
        const userExists = getUserById(req.params.id);

        if (userExists) {
            res.send(userExists);
        } else {
            res.status(422);
            res.send("Usuário não encontrado.");
        }
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function postUser(req, res) {
    try {
        if (getUserActiveByEmail(req.body.email)) {
            res.status(422);
            res.send({
                "message": "Usuário já existe."
            });
        } else if (getUserNotActiveByEmail(req.body.email)) {
            activeUser(req.body, getUserNotActiveByEmail(req.body.email).id)
            res.status(201);
            res.send({
                "message": "Usuário foi ativado novamente."
            });
        } else if (
            req.body.email &&
            req.body.password &&
            req.body.fullName &&
            req.body.firstName
        ) {
            insertUser(req.body);
            res.status(201);
            res.send({
                "message": "Usuário adicionado com sucesso!"
            });
        } else {
            res.status(422);
            res.send({
                "message": "Campos email, password, fullName e firstName são obrigatórios."
            });
        }

    } catch (error) {
        res.status(500);
        res.send({
            "message": error.message
        });
    }
}

function patchUser(req, res) {
    try {
        const id = req.params.id;
        const body = req.body;
        const idExisting = getUserById(id).id;

        if (idExisting === id) {
            modifyUser(body, id);
            res.send({
                'message': 'Usuário modificado com sucesso!'
            });
        }
        else {
            res.status(422);
            res.send({
                'message': 'Usuário não encontrado.'
            });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

function deleteUser(req, res) {
    try {
        const user = getUserById(req.params.id);
        if (user) {
            excludeUser(req.params.id);
            res.send({
                "message": `Usuário ${user.firstName} excluído com sucesso!`
            });
        } else {
            res.status(422);
            res.send({
                "message": "Usuário não encontrado."
            });
        }

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

module.exports = {
    getUsers,
    getUserLogin,
    getUser,
    postUser,
    patchUser,
    deleteUser
}
