module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define("task", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    startdate: {
      type: DataTypes.STRING,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    endDate: {
      type: DataTypes.DATE,
      get() {
        const completed = this.getDataValue("completed");

        return completed ? new Date() : null;
      },
    },
    remarks: {
      type: DataTypes.STRING,
    },
    //* need to handle the create project status table to allow not null
    projectStatusId: {
      type: DataTypes.UUID,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  return Task;
};
