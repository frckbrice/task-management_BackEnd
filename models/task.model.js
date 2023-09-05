module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define("task", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    task_code: {
      type: DataTypes.STRING,
    },
    task_description: {
      type: DataTypes.STRING,
    },
    task_status: {
      type: DataTypes.STRING,
    },
    task_startdate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW(),
    },
    task_enddate: {
      type: DataTypes.DATE,
    },
    task_remarks: {
      type: DataTypes.STRING,
    },
    task_color: {
      type: DataTypes.STRING,
    },
  });

  return Task;
};
