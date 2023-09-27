module.exports = (sequelize, DataTypes) => {
  const ProjectStatus = sequelize.define('projectStatus',{
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    designation: {
      type: DataTypes.STRING,
      allowNull:false,
      defaultValue: 'todo'
    },
    // color: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    // positionInTheList: DataTypes.TINYINT,
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  })

  return ProjectStatus;
}