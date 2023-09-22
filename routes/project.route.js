const router = require('express').Router();

const {projectController} = require('../controllers');

const verifyJwt = require('../middleware/verifyJwt')

router.use(verifyJwt);

router
  .route("/")
  .get(projectController.getAllUserProject)
  .post(projectController.createProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

router
  .route("/members")
  .post( projectController.getProjectMembers);

router
  .route("/collaborations")
  .get(projectController.projectCollaborations);

module.exports = router;