const Sequelize = require("sequelize");

const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.DIALECT,

  define: {
    //   freezeTableName: true,
    paranoid: true,
  },
});

const db = {};
db.models = {};

db.models.Project = require("./project.model")(sequelize, Sequelize.DataTypes);
db.models.Member = require("./member.model")(sequelize, Sequelize.DataTypes);
db.models.Task = require("./task.model")(sequelize, Sequelize.DataTypes);
db.models.Updates = require("./updates.models")(sequelize, Sequelize.DataTypes);
db.models.Team = require("./team.model")(sequelize, Sequelize.DataTypes);
db.models.Roles = require("./roles.model")(sequelize, Sequelize.DataTypes);
db.models.TeamMember = require("./teamMember.model")(
  sequelize,
  Sequelize.DataTypes
);
db.models.TaskMember = require("./taskmember.model")(
  sequelize,
  Sequelize.DataTypes
);

const { Project, Member, Task, Updates, Team, Roles, TeamMember, TaskMember } =
  db.models;

db.sequelize = sequelize;

//  Member.hasOne()
Task.hasMany(Updates);
Updates.belongsTo(Task);

Member.hasMany(Updates);
Updates.belongsTo(Member);

Member.hasMany(Project, { foreignKey: "projectManagerId" });
Project.belongsTo(Member, {
  as: "project_manager",
  foreignKey: "projectManagerId",
});

Project.hasMany(Task);
Task.belongsTo(Project);

Task.belongsToMany(Member, { through: TaskMember });
Member.belongsToMany(Task, { through: TaskMember });

Member.belongsTo(Team);
Team.hasMany(Member);

Member.hasMany(Member, { as: "invitedMember", foreignKey: "projectManagerId" });
Member.belongsTo(Member, {
  as: "project_manager",
  foreignKey: "projectManagerId",
});

// Roles.hasMany(Member);
// Member.belongsTo(Roles);

Project.hasOne(Team);
Team.belongsTo(Project);

module.exports = db;
