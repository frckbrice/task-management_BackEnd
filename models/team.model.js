module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define("projectTeam", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    logo: {
      type: DataTypes.STRING,
    },
    color: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  return Team;
}