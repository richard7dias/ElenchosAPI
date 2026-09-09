const { Router } = require("express");
const { getSourceExpenses, getSourceExpense, postSourceExpense, patchSourceExpense, deleteSourceExpense, getCurrentMonthValue } = require('../../controllers/sourceExpenses/sourceExpense');

const router = Router();

router.get('/:idOwner', getSourceExpenses);

router.get('/currentMonthValue/:idOwner', getCurrentMonthValue);

router.get('/:idOwner/:id', getSourceExpense);

router.post('/:idOwner', postSourceExpense);

router.patch('/:idOwner/:id', patchSourceExpense);

router.delete('/:idOwner/:id', deleteSourceExpense);

module.exports = router;