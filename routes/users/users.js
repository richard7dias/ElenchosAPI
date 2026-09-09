const { Router } = require("express");
const { getUsers, getUserLogin, getUser, postUser, patchUser, deleteUser } = require('../../controllers/users/users');

const router = Router();

router.get('/', getUsers);

router.get('/:email/:password', getUserLogin);

router.get('/:id', getUser);

router.post('/', postUser);

router.patch('/:id', patchUser);

router.delete('/:id', deleteUser);

module.exports = router;