const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define("project", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    project_name: {
      type: DataTypes.STRING,
    },
    project_description: {
      type: DataTypes.TEXT,
    },
    project_banner: {
      type: DataTypes.STRING,
    },
    project_startDate: {
      type: DataTypes.DATE,
    },
    project_estimateEndDate: {
      type: DataTypes.DATE,
    },
    project_completed: DataTypes.BOOLEAN,
    project_endDate: {
      type: DataTypes.DATE,
      get() {
        const completed = this.getDataValue("task_completed");

        return completed ? new Date() : null;
      },
    },
    project_remarks: {
      type: DataTypes.STRING,
    },
    project_status: DataTypes.STRING,
  });

  return Project;
};
