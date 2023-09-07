const Member = require("./member.model");

module.exports = (sequelize, DataTypes) => {
  const EmailAddress = sequelize.define("emailAddress", {
    emailtoken: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    emailDesignation: {
      type: DataTypes.STRING,
    },
    emailProvider: {
      type: DataTypes.STRING,
    },
    projectMemberId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  return EmailAddress;
};
