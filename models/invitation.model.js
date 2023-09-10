module.exports = (sequelize, DataTypes) => {
  const Invitation = sequelize.define("invitation", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: DataTypes.DATE,
    accepted: DataTypes.BOOLEAN,
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    projectManagerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  return Invitation
};