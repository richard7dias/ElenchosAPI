const { Router } = require("express");
const { getLaunches, getLaunchesMonth, getLaunch, postLaunch, patchLaunch, deleteLaunch } = require('../../controllers/launches/launches');

const router = Router();

router.get('/:idOwner', getLaunches);

router.get('/byCurrentMonth/:monthNumber/:idOwner', getLaunchesMonth);

router.get('/:idOwner/:id', getLaunch);

router.post('/:idOwner', postLaunch);

router.patch('/:idOwner/:id', patchLaunch);

router.delete('/:idOwner/:id', deleteLaunch);

module.exports = router;