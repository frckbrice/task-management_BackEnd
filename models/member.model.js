module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define(
    "projectMember",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      project_member_name: {
        type: DataTypes.STRING,
      },
      project_member_contact: {
        type: DataTypes.STRING,
      },
      project_member_username: {
        type: DataTypes.STRING,

        get() {
          const rawValue = this.getDataValue("project_member_username");
          return rawValue ? rawValue.toLowerCase() : "Unknown Member";
        },
      },
      project_member_password: {
        type: DataTypes.STRING,
      },
      project_member_skills: {
        type: DataTypes.TEXT,
      },
      project_member_role: {
        type: DataTypes.ENUM("admin", "manager", "invitie"),
        allowNull: false,
        defaultValue: "manager",
      },
      project_member_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      validate: {
        usernamePassMatch() {
          if (this.project_member_username === this.project_member_password) {
            throw new Error("Password and username shoud not match");
          }
        },
      },
      // timestamps: false,
    }
  );

  return Member;
};
