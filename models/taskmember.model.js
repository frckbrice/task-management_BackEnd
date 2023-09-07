module.exports = (sequelize, DataTypes) => {
  const TaskMember = sequelize.define(
    "taskMember",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      start_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW(),
      },
      end_date: DataTypes.DATE,
      task_member_observation: DataTypes.TEXT,
      task_status: DataTypes.STRING,
    },
    {
      // timestamps: false,
    }
  );

  return TaskMember;
};
