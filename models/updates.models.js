const Member = require('./member.model')

module.exports = (sequelize, DataTypes) => {
  const Updates = sequelize.define("taskUpdate", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    action: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    remarks: {
      type: DataTypes.STRING,
    },
    projectMemberId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    taskId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  return Updates;
};
