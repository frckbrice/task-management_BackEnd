const router = require("express").Router();

const { taskController } = require("../controllers");

const verifyJwt = require('../middleware/verifyJwt')

router.use(verifyJwt);

router
  .route("/")
  .get(taskController.getAllTask)
  .post(taskController.createTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

router
  .route("/onboarding")
  .post(taskController.createTaskOnboarding);

router
  .route("/assignToMember")
  .post(taskController.assignTaskTomember);

router
  .route("/updatOnDrag&Drop")
  .post(taskController.updateOnStatusChange);

module.exports = router;
