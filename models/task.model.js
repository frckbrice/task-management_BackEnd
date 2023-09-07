module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define("task", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    task_name: {
      type: DataTypes.STRING,
    },
    task_description: {
      type: DataTypes.TEXT,
    },
    task_status: {
      type: DataTypes.STRING,
    },
    task_startdate: {
      type: DataTypes.STRING,
    },
    task_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    task_endDate: {
      type: DataTypes.DATE,
      get() {
        const completed = this.getDataValue("task_completed");

        return completed ? new Date() : null;
      },
    },
    task_remarks: {
      type: DataTypes.STRING,
    },
    // task_color: {
    //   type: DataTypes.STRING,
    // },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false
    },
  });

  return Task;
};
