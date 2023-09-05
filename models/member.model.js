module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define(
    "project_member",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      project_member_code: {
        type: DataTypes.STRING,
      },

      project_member_name: {
        type: DataTypes.STRING,
      },
      project_member_contact: {
        type: DataTypes.STRING,
      },
      project_member_email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
      },
      project_member_username: {
        type: DataTypes.STRING,
      },
      project_member_password: {
        type: DataTypes.STRING,
      },
      project_member_status: {
        type: DataTypes.STRING,
      },
      project_member_startingDate: {
        type: DataTypes.STRING,
      },
      project_member_skills: {
        type: DataTypes.TEXT,
      },
    },
    {
      validate: {
        usernamePassMatch() {
          if (this.username === this.password) {
            throw new Error("Password and username shoud not match");
          }
        },
      },
      // timestamps: false,
    }
  );

  return Member;
};
