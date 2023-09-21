module.exports = (sequelize, DataTypes) => {
  const Invitation = sequelize.define("invitation", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    accepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    notified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    projectManagerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    content: DataTypes.TEXT,
  });

  return Invitation
};