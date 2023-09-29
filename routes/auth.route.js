const router = require("express").Router();

const { authController } = require("../controllers");

const loginLimiter = require("../middleware/loginLimiter");
const passport = require("passport");
const isAuth = require("../middleware/auth");

//* to be added. do not forget to handle the failureRedirect/successRedirect below
// router.route("/").post(loginLimiter, authController.login);



router
  .route("/login/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router.route("/google/callback").get(
  passport.authenticate("google", {
    failureMessage: " cannot login with google, please try again later!",
    failureRedirect: "https://tms-gdb08-0923.onrender.com/signup",
    successRedirect: "https://tms-gdb08-0923.onrender.com/dashboard",
  }),
  (req, res) => {
    console.log("User: " + req.user);
    res.json({ message: "Thank you for signing in!" });
  }
);

router
  .route("/login", passport.authenticate("local", { failureRedirect: "/" }))
  .post(loginLimiter, authController.login);

router.route("/googleLogin").post(loginLimiter, authController.googleLogin);

router.route("/logout").post(authController.logout);

router.route("/register").post(authController.register);

router.route("/googleRegister").post(authController.googleRegister);

router.route("/refresh").get(authController.refresh);

app.get("/x-forwarded-for", (request, response) =>
  response.send(request.headers["x-forwarded-for"])
);

module.exports = router;
