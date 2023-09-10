module.exports = (sequelize, DataTypes) => {
  const TaskMember = sequelize.define(
    "taskMember",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW(),
      },
    
      observation: DataTypes.TEXT,
      taskStatus: DataTypes.STRING,
    },
    {
      // timestamps: false,
    }
  );

  return TaskMember;
};
