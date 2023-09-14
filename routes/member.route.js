const router = require('express').Router();

const {memberController} = require('../controllers');

const verifyJwt = require('../middleware/verifyJwt')

router.use(verifyJwt);

router
  .route('/')
  .get(memberController.getAllMembers)
  .post(memberController.createMember)
  .patch(memberController.updateMember)
  .delete(memberController.deleteMember)

router
  .get('/user', memberController.googleinvitedMember);



  module.exports = router;