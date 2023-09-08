const router = require("express").Router();

const { updatesController } = require("../controllers");

const verifyJwt = require('../middleware/verifyJwt')

// router.use(verifyJwt);

router
  .route("/")
  .get(updatesController.getAllUpdates)
  .post(updatesController.createUpdate)
  .patch(updatesController.updateUpdate)
  .delete(updatesController.deleteUpdate);

module.exports = router;
