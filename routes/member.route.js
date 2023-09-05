const router = require('express').Router();

const {memberController} = require('../controllers');

router
  .route('/')
  .get(memberController.getAllMembers)
  .post(memberController.createMember)
  .patch(memberController.updateMember)
  .delete(memberController.deleteMember)


  module.exports = router;