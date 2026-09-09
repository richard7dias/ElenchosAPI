const { Router } = require("express");
const { getEntries, getEntry, postEntry, patchEntry, deleteEntry } = require('../../controllers/entries/entries');

const router = Router();

router.get('/:idOwner', getEntries);

router.get('/:idOwner/:id', getEntry);

router.post('/:idOwner', postEntry);

router.patch('/:idOwner/:id', patchEntry);

router.delete('/:idOwner/:id', deleteEntry);

module.exports = router;