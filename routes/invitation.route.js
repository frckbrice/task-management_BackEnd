const router = require("express").Router();

const { invitatationContoller } = require("../controllers");

const verifyJwt = require("../middleware/verifyJwt");

router.use(verifyJwt);

router
  .route("/")
  .get(invitatationContoller.getAllInvitations)
  .post(invitatationContoller.createInvitation)
  .patch(invitatationContoller.updateInvitation)
  .delete(invitatationContoller.deleteInvitation);

router  
  .route('/confirm')
  .post(invitatationContoller.handleInvite)

router.route("/notifications").get(invitatationContoller.handlenotifications);  

module.exports = router;
