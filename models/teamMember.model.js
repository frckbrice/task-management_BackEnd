module.exports = (sequelize, DataTypes) => {
  const TeamMember = sequelize.define(
    "team_member",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      team_member_observation: DataTypes.STRING,
    },
    {
      timestamps: false,
    }
  );

  return TeamMember;
};
