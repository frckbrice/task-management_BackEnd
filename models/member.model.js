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
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,

        get() {
          const rawValue = this.getDataValue("username");
          return rawValue ? rawValue.toLowerCase() : "Unknown Member";
        },
      },
      password: {
        type: DataTypes.STRING,
      },
      skills: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "manager",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // teamId: {
      //   type: DataTypes.UUID,
      //   allowNull: true,
      // },
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

  // Member.prototype.removePassword = function () {
  //   delete this.dataValues.password;
  //   return this;
  // };

  return Member;
};
