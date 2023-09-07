const { Member, Project, Team, Task } = require("../models").models;
const { Op } = require("sequelize");

const bcrypt = require("bcrypt");

module.exports = {
  //@desc get all members
  //@route GET /members
  //access Private

  getAllMembers: async (req, res) => {
    Member.findAll({
      attributes: {
        exclude: ["project_member_password"],
      },
    }).then((data) => {
      console.log(data);
      if (!data.length)
        return res.status(400).json({ message: "No members found" });
      res.json(data);
    });
  },

  //@desc create member
  //@route POST /members
  //access private
  createMember: async (req, res) => {
    const {
      project_member_name,
      project_member_contact,
      project_member_username,
      project_member_password,
      project_member_skills,
      project_member_role,
      project_member_active,
    } = req.body;

    if (
      !project_member_username ||
      !project_member_password ||
      !project_member_role ||
      !project_member_skills || 
      !project_member_active 
      
    ) {
      return res.json({ message: "All fields are required" });
    }

    const duplicates = await Member.findOne({
      where: {
        project_member_username
      },
    });

    if (duplicates) {
      console.log(duplicates);
      return res
        .status(409)
        .json({ message: `${project_member_username} already exists` });
    }

    // if (project_member_role !== "manager") {
    //   const manager = await Project.findOne({
    //     where: {
    //       project_member_role: {
    //         [Op.eq]: "manager",
    //       },
    //     },
    //   });

    //   if (project_member_role !== "manager") {
    //     const manager = await Member.findOne({
    //       where: {
    //         project_member_role: {
    //           [Op.eq]: "manager",
    //         },
    //       },
    //     });

    //     if (manager) {
    //       projectManager = manager.id;
    //     }
    //   }
    // }
    //* hash password
    const hashPw = await bcrypt.hash(project_member_password, 10);

    const uniformMember = {
      project_member_active,
      project_member_contact,
      project_member_name,
      project_member_password: hashPw,
      project_member_role,
      project_member_skills,
      project_member_username,
    };

    Member.create(uniformMember).then((data) => {
      if (data) {
        console.log(data);
        res.status(201).json({
          message: `The member ${project_member_username} successfully created`,
          data,
        });
      } else {
        return res.json({ message: "Failed to create member" });
      }
    });
  },

  //@desc update a member
  //@route PATCH /members
  //access Private
  updateMember: async (req, res) => {
    const {
      id,
      project_member_name,
      project_member_contact,
      project_member_username,
      project_member_password,
      project_member_skills,
      project_member_role,
      project_member_active,
    } = req.body;

    if (
      !id ||
      !project_member_username ||
      !project_member_role ||
      !Boolean(project_member_active)
    ) {
      return res.status(400).json({ message: "All the fields are required" });
    }

    //find the existing
    const existingMember = await Member.findByPk(id);
    if (!existingMember) {
      return res.status(400).json({ message: "This member doesn't exist" });
    }

    //find duplicates
    const duplicates = await Member.findOne({
      where: {
        project_member_username,
      },
    });

    if (duplicates && duplicates.id.toString() !== id.toString()) {
      return res
        .status(409)
        .json({ message: "duplicates member: same username" });
    }

    existingMember.project_member_active = project_member_active;
    existingMember.project_member_contact = project_member_contact;
    existingMember.project_member_name = project_member_name;

    existingMember.project_member_role = project_member_role;
    existingMember.project_member_skills = project_member_skills;
    existingMember.project_member_username = project_member_username;

    if (project_member_password) {
      existingMember.project_member_password = await bcrypt.hash(
        project_member_password,
        10
      );
    }

    await existingMember.save();
    res.json({ msg: `user successfully updated` });
  },

  //@desc delete a member
  //@route DELETE /members
  //access Private
  deleteMember: async (req, res) => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "member Id required" });
    }

    //find existing
    const existingMember = await Member.findByPk(id);

    if (!existingMember) {
      return res
        .status(400)
        .json({ message: `The member with id ${id} doesn't exist` });
    }

    const deletedMember = await existingMember.destroy();

    if (deletedMember) {
      return res
        .status(201)
        .json({ message: `The member with id ${id} deleted successfully` });
    }
  },
};
