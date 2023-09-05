const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define("project", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    project_code: {
      type: DataTypes.STRING,
    },
    project_name: {
      type: DataTypes.STRING,
    },
    project_description: {
      type: DataTypes.STRING,
    },
    project_banner: {
      type: DataTypes.STRING,
    },
    project_startDate: {
      type: DataTypes.DATEONLY,
    },
    project_endDate: {
      type: DataTypes.DATEONLY,
    },
    project_remarks: {
      type: DataTypes.STRING,
    },
    project_status: DataTypes.STRING,
  });

  return Project;
};
