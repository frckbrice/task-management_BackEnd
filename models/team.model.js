module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define("projectTeam", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    team_name: {
      type: DataTypes.STRING,
    },
    team_description: {
      type: DataTypes.STRING,
    },
    team_logo: {
      type: DataTypes.STRING,
    },
    team_color: {
      type: DataTypes.STRING,
    },
    team_status: {
      type: DataTypes.STRING,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  return Team;
}