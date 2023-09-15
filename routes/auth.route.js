const router = require("express").Router();

const { authController } = require("../controllers");

const loginLimiter = require("../middleware/loginLimiter");
const passport = require("passport");
const isAuth = require("../middleware/auth");

//* to be added. do not forget to handle the failureRedirect/successRedirect below
// router.route("/").post(loginLimiter, authController.login);

router.route("/login").post(loginLimiter, authController.login);

router
  .route("/login/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router.route("/google/callback").get(
  passport.authenticate("google", {
    failureMessage: " cannot login with google, please try again later!",
    failureRedirect: "http://localhost:3000/signup",
    successRedirect: "http://localhost:3000/dashboard",
  }),
  (req, res) => {
    console.log("User: " + req.user);
    res.json({ message: "Thank you for signing in!" });
  }
);

router.route("/logout").post(authController.logout);

router.route("/register").post(authController.register);

router.route("/refresh").get(authController.refresh);

module.exports = router;
