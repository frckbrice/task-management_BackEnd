const { Task } = require("./task.model");
const { Member } = require("./member.model");

module.exports = (sequelize, DataTypes) => {
  const TaskMember = sequelize.define("taskMember", {
    taskId: {
      type: DataTypes.UUID,
      reference: {
        model: Task,
        key: "id",
      },
    },
    projectMemberId: {
      type: DataTypes.UUID,
      reference: {
        model: Member,
        key: "id",
      },
    },

    remarks: DataTypes.TEXT,
  });

  return TaskMember;
};
