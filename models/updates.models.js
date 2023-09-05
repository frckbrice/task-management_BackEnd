module.exports = (sequelize, DataTypes) => {
  const Updates = sequelize.define("task_update", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    task_update_action: {
      type: DataTypes.STRING,
    },
    task_update_description: {
      type: DataTypes.STRING,
    },
    task_remarks: {
      type: DataTypes.STRING,
    },
  });

  return Updates;
};
