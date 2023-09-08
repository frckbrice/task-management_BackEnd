const router = require('express').Router();

const {projectController} = require('../controllers');

const verifyJwt = require('../middleware/verifyJwt')

// router.use(verifyJwt);

router
  .route('/')
  .get(projectController.getAllProject)
  .post(projectController.createProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject)

router
  .route("/members")
  .get(projectController.getProjectMembers);

module.exports = router;