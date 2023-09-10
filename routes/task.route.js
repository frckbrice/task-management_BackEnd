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

module.exports = router;
