const router = require("express").Router();

const { invitatationContoller } = require("../controllers");

// const verifyJwt = require("../middleware/verifyJwt");

// router.use(verifyJwt);

router
  .route("/")
  .get(invitatationContoller.getAllInvitations)
  .post(invitatationContoller.createInvitation)
  .patch(invitatationContoller.updateInvitation)
  .delete(invitatationContoller.deleteInvitation);

router  
  .route('/:id')
  .get(invitatationContoller.handleInvite)

module.exports = router;
