const router = require("express").Router();

const { authController } = require("../controllers");

const loginLimiter = require('../middleware/loginLimiter')

router
  .route("/")
  .post( authController.login);

router
  .route('/logout')
  .post(authController.logout);

router
  .route('/refresh')
  .get(authController.refresh);

module.exports = router;
