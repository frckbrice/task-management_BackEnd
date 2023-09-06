const router = require('express').Router();

const {projectController} = require('../controllers');

router
  .route('/')
  .get(projectController.getAllProject)
  .get(projectController.getProjectMembers)
  .post(projectController.createProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject)

module.exports = router;