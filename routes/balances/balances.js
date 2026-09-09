const { Router } = require("express");
const { getBalances, getBalance, postBalance, patchBalance, deleteBalance } = require('../../controllers/balances/balances');

const router = Router();

router.get('/:idOwner', getBalances);

router.get('/:idOwner/:id', getBalance);

router.post('/:idOwner', postBalance);

router.patch('/:idOwner/:id', patchBalance);

router.delete('/:idOwner/:id', deleteBalance);

module.exports = router;