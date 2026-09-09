const { Router } = require("express");
const { getCurrencies, getCurrency, postCurrency, patchCurrency, deleteCurrency } = require('../../controllers/currencies/currency');

const router = Router();

router.get('/:idOwner', getCurrencies);

router.get('/:idOwner/:id', getCurrency);

router.post('/:idOwner', postCurrency);

router.patch('/:idOwner/:id', patchCurrency);

router.delete('/:idOwner/:IsNameOrId/:nameOrId', deleteCurrency);

module.exports = router;