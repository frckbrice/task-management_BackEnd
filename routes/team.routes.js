const router = require("express").Router();

const { teamController } = require("../controllers");

router
  .route("/")
  .get(teamController.getAllTeams)
  .post(teamController.createTeam)
  .patch(teamController.updateTeam)
  .delete(teamController.deleteTeam);

module.exports = router;
