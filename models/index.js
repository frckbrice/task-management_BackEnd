const Sequelize = require("sequelize");

const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.DIALECT,
  PORT: dbConfig.PORT,
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
db.models.Invitation = require("./invitation.model")(sequelize, Sequelize.DataTypes);
db.models.EmailAddress = require("./emailAddress.model")(
  sequelize,
  Sequelize.DataTypes
);
db.models.TaskMember = require("./taskmember.model")(
  sequelize,
  Sequelize.DataTypes
);

const { 
  Project,
  Member,
  Task,
  Updates,
  Team,
  Invitation,
  EmailAddress,
  TaskMember } =
  db.models;

db.sequelize = sequelize;

//  Member.hasOne()
Task.hasMany(Updates);
Updates.belongsTo(Task);

Member.hasMany(Updates);
Updates.belongsTo(Member);

Member.hasMany(Project, { foreignKey: "projectManagerId" });
Project.belongsTo(Member, {as:'projectManager',
  foreignKey: "projectManagerId",
});

Project.hasMany(Task);
Task.belongsTo(Project);

Task.belongsToMany(Member, { through: TaskMember, uniqueKey: 'TaskMemberId' });
Member.belongsToMany(Task, { through: TaskMember, uniqueKey: "TaskMemberId" });

Member.belongsTo(Team);
Team.hasMany(Member);

Member.hasMany(Invitation, {foreignKey: 'projectManagerId'});
Invitation.belongsTo(Member, {as: 'projectManager', foreignKey: 'projectManagerId'});

Project.hasMany(Invitation);
Invitation.belongsTo(Project)

Invitation.hasMany(EmailAddress);
EmailAddress.belongsTo(Invitation);

Member.hasMany(EmailAddress);
EmailAddress.belongsTo(Member);

Project.hasOne(Team);
Team.belongsTo(Project);

module.exports = db;
