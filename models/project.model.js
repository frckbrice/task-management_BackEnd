const { DataTypes } = require("sequelize");
const Member = require('./member.model')
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define("project", {
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
    banner: {
      type: DataTypes.STRING,
    },
    startDate: {
      type: DataTypes.DATE,
    },
    estimateEndDate: {
      type: DataTypes.DATE,
    },
    completed: DataTypes.BOOLEAN,
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
    status: DataTypes.STRING,
    projectManagerId: {
      type: DataTypes.UUID,
      allowNull: false,
      
    },
  });

  return Project;
};
