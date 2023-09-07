const Member = require('./member.model')

module.exports = (sequelize, DataTypes) => {
  const Updates = sequelize.define("taskUpdate", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    task_update_action: {
      type: DataTypes.STRING,
    },
    task_update_description: {
      type: DataTypes.TEXT,
    },
    task_update_remarks: {
      type: DataTypes.STRING,
    },
    projectMemberId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  return Updates;
};