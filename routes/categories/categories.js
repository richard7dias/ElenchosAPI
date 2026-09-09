const { Router } = require("express");
const { getCategories, getCategory, postCategory, patchCategory, deleteCategory } = require('../../controllers/categories/categories');


const router = Router();

router.get('/:idOwner', getCategories);

router.get('/:idOwner/:id', getCategory);

router.post('/:idOwner', postCategory);

router.patch('/:idOwner/:id', patchCategory);

router.delete('/:idOwner/:id', deleteCategory);

module.exports = router;