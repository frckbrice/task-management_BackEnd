const router = require("express").Router();

const { authController } = require("../controllers");

const loginLimiter = require('../middleware/loginLimiter')
const passport = require('passport')

//* to be added. do not forget to handle the failureRedirect/successRedirect below
// router.route("/").post(loginLimiter, authController.login);

router
  .route("/login")
  .post(loginLimiter, authController.login);

router
  .route("/login/google")
  .get( passport.authenticate("google", { scope: ["profile", "email"] }));

router.route("/google/callback").get(
  passport.authenticate("google", {
    failureMessage: " cannot login with google, please try again later!",
    failureRedirect: "http://localhost:5173/login",
    successRedirect: "http://localhost:5173/login/success",
  }),
  (req, res) => {
    console.log("User: " + req.user);
    res.json({ message: "Thank you for signing in!" });
  }
);

router
  .route('/logout')
  .post(authController.logout);

router
  .route("/refresh")
  .get(authController.refresh);

// router.route("/user").get();

module.exports = router;
