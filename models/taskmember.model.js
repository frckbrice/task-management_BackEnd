module.exports = (sequelize, DataTypes) => {
  const TaskMember = sequelize.define(
    "task_member",
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
      task_state: DataTypes.STRING
    },
    {
      // timestamps: false,
    }
  );

  return TaskMember;
};
