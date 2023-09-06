const router = require("express").Router();

const { updatesController } = require("../controllers");

router
  .route("/")
  .get(updatesController.getAllUpdates)
  .post(updatesController.createUpdate)
  .patch(updatesController.updateUpdate)
  .delete(updatesController.deleteUpdate);

module.exports = router;
