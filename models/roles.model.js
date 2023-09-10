module.exports = (sequelize, DataTypes) => {

  const Roles = sequelize.define("roles", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_description: {
      type: DataTypes.STRING,
    },
  });

  return Roles;
};