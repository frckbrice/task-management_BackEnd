const router = require("express").Router();

const { projectStatusController } = require("../controllers");

const verifyJwt = require("../middleware/verifyJwt");

router.use(verifyJwt);

router
  .route("/")
  // .get(projectStatusController.getAllProjectStatus)
  .post(projectStatusController.createProjectStatus)
  .patch(projectStatusController.updateProjectStatus)
  .delete(projectStatusController.deleteProjectStatus);

router
  .route("/ofproject")
  .post(projectStatusController.getAllProjectStatus);

module.exports = router;
