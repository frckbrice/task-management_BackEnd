const { Member, Project, Team, Task } = require("../models").models;
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");

const bcrypt = require("bcrypt");

module.exports = {
  //@desc get all members
  //@route GET /members
  //access Private

  getAllMembers: asyncHandler(async (req, res) => {
    Member.findAll({
      attributes: {
        exclude: ["password"],
      },
    })
      .then((data) => {
        console.log(data);
        if (!data.length)
          return res.status(400).json({ message: "No members found" });
        res.json(data);
      })
      .catch(function (err) {
        console.log("An error occured while loading members", err);
        return res.status(500).json({ message: "Not able to find members for the moment. please try again later" });
      });
  }),

  //@desc create member
  //@route POST /members
  //access private
  createMember: asyncHandler(async (req, res) => {
    const {
      name,
      contact,
      username,
      password,
      skills,
      role,
      isActive,
      picture,
    } = req.body;

    if (
      !username ||
      !password ||
      !role ||
      !skills ||
      !isActive
    ) {
      return res.json({ message: "All fields are required" });
    }

    const duplicates = await Member.findOne({
      where: {
        username,
      },
    })

    if (duplicates) {
      console.log(duplicates);
      return res
        .status(409)
        .json({ message: `${username} already exists` });
    }

    // if (role !== "manager") {
    //   const manager = await Project.findOne({
    //     where: {
    //       role: {
    //         [Op.eq]: "manager",
    //       },
    //     },
    //   });

    //     if (manager) {
    //       projectManager = manager.id;
    //     }
    //   }
    // }
    //* hash password
    const hashPw = await bcrypt.hash(password, 10);

    const uniformMember = {
      isActive,
      contact,
      name,
      password: hashPw,
      role,
      skills,
      username,
      picture,
    };

    Member.create(uniformMember)
      .then((data) => {
        if (data) {
          console.log(data);
          res.status(201).json({
            message: `The user ${username} successfully created`,
            data,
          });
        } else {
          return res.json({ message: "Failed to create user" });
        }
      })
  }),

  //@desc update a member
  //@route PATCH /members
  //access Private
  updateMember: asyncHandler(async (req, res) => {
    const {
      id,
      name,
      contact,
      username,
      password,
      skills,
      role,
      isActive,
      picture,
    } = req.body;

    if (
      !id ||
      !username ||
      !role ||
      !Boolean(active)
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
        username,
      },
    })

    if (duplicates && duplicates.id.toString() !== id.toString()) {
      return res
        .status(409)
        .json({ message: "duplicates member: same username" });
    }

    existingMember.isActive = isActive;
    existingMember.contact = contact;
    existingMember.name = name;

    existingMember.role = role;
    existingMember.skills = skills;
    existingMember.username = username;
    existingMember.picture = picture;

    if (password) {
      existingMember.password = await bcrypt.hash(
        password,
        10
      );
    }

    await existingMember.save();
    res.json({ msg: `user successfully updated` });
  }),

  //@desc delete a member
  //@route DELETE /members
  //access Private
  deleteMember: asyncHandler(async (req, res) => {
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

    const deletedMember = await existingMember
      .destroy();

    if (deletedMember) {
      return res
        .status(201)
        .json({ message: `The member with id ${id} deleted successfully` });
    }
  }),

  //google authenticated user
  googleinvitedMember: asyncHandler(async(req, res)=> {
    res.json({message: "google authenticated member", user: req.user})
  } )

};
