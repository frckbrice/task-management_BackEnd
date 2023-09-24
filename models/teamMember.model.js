const {Member} = require('./member.model')
const { Team } = require("./team.model")

module.exports = (sequelize, DataTypes) => {
  const TeamMember = sequelize.define(
    "teamMember",
    {
      projectMemberId: {
        type: DataTypes.UUID,
        references: {
          model: Member,
          key: "id",
        },
      },
      projectTeamId: {
        type: DataTypes.UUID,
        references: {
          model: Team, 
          key: "id",
        },
      },
      memberRole: {
        type: DataTypes.STRING,
        defaultValue: "manager"
      },
      observation: DataTypes.STRING,
    },
    {
      // timestamps: false,
    }
  );

  return TeamMember;
};
