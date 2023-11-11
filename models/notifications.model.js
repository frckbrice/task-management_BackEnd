module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define("Notification", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    targetEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    projectManagerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });
  return Notification;
};
