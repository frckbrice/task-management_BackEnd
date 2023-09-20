const Member = require("./member.model");

module.exports = (sequelize, DataTypes) => {
  const EmailAddress = sequelize.define("emailAddress", {
    token: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    designation: {
      type: DataTypes.STRING,
    },
    provider: {
      type: DataTypes.STRING,
    },
    projectMemberId: {
      type: DataTypes.UUID,
    },
    projectManagerId: {
      type: DataTypes.UUID,
    },
    invitationId: {
      type: DataTypes.UUID,
    },
  });

  return EmailAddress;
};
