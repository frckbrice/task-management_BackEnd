const router = require("express").Router();

const { authController } = require("../controllers");

router
  .route("/")
  .post(authController.login)
  .post(authController.logout)
  .get(authController.refresh);

module.exports = router;
