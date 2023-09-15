const router = require("express").Router();

const { teamController } = require("../controllers");

const verifyJwt = require('../middleware/verifyJwt')

router.use(verifyJwt);

router
  .route("/")
  .get(teamController.getAllTeams)
  .post(teamController.createTeam)
  .patch(teamController.updateTeam)
  .delete(teamController.deleteTeam);

module.exports = router;
