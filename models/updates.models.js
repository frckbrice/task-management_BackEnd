module.exports = (sequelize, DataTypes) => {
  const Updates = sequelize.define("task_update", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    task_update_code: {
      type: DataTypes.STRING,
    },
    task_update_description: {
      type: DataTypes.STRING,
    },
    task_update_status: {
      type: DataTypes.STRING,
    },
    task_update_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW(),
    },
    task_remarks: {
      type: DataTypes.STRING,
    },
  });

  return Updates;
};
