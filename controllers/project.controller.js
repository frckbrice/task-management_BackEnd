const { Project, Member, Team, Task } = require("../models").models;
const { Op } = require("sequelize");

const bcrypt = require("bcrypt");

module.exports = {
  //@desc get all project
  //@route GET /project
  //access Private

  getAllProject: async (req, res) => {
    Project.findAll().then((data) => {
      console.log(data);
      if (!data.length)
        return res.status(400).json({ message: "No project found" });
      res.json(data);
    });
  },

  //@desc get all project members
  //@route GET /project/members
  //access Private
  getProjectMembers: async (req, res) => {
    const { id } = req.body;

    if (!id)
      return res.status(400).json({ message: " Id is needed" });

    // const targetProject = await Project.findByPk(id, {
    //   include: Team,
    // });
    const targetProject = await Project.findByPk(id);
    if (!targetProject)
      return res.status(404).json({ message: "This project doesn't exist" });

    const projectTeam = await targetProject.getTeam();
    if (!projectTeam)
      return res
        .status(404)
        .json({ message: "This project dont have a team in charge" });

    const projectMember = (
      await projectTeam.getMembers({
        attributes: ["project_member_username"],
        raw: true,
      })
    ).map((member) => member.project_member_username);

    if (!projectMember.length)
      return res
        .status(404)
        .json({ message: "This project team doesn't have members" });

    res.json({
      message: `List of member associated ${targetProject.project_name}`,
      projectMember,
    });
  },

  //@desc create project
  //@route POST /project
  //access private
  createProject: async (req, res) => {
    const {
      project_name,
      project_description,
      project_banner,
      project_startDate,
      project_endDate,
      project_remarks,
      project_status,
    } = req.body;

    if (
      !project_name ||
      !project_description ||
      !project_status ||
      !project_banner ||
      !project_startDate ||
      !project_endDate
    ) {
      return res.json({ message: "All fields are required" });
    }

    const duplicates = await Project.findOne({
      where: {
        project_name,
      },
    });

    if (duplicates) {
      console.log(duplicates);
      return res
        .status(409)
        .json({ message: `${project_name} already exists` });
    }

    const uniformProject = {
      project_name,
      project_description,
      project_banner,
      project_startDate,
      project_endDate,
      project_remarks,
      project_status,
    };

    Project.create(uniformProject).then((data) => {
      if (data) {
        console.log(data);
        res.status(201).json({
          message: `The project ${project_name} successfully created`,
          data,
        });
      } else {
        return res.json({ message: "Failed to create project" });
      }
    });
  },

  //@desc update a project
  //@route PATCH /projects
  //access Private
  updateProject: async (req, res) => {
    const {
      id,

      project_name,
      project_description,
      project_banner,
      project_startDate,
      project_completed,
      project_remarks,
      project_status,
    } = req.body;

    if (!id || !project_name || !project_status || !project_remarks) {
      return res.status(400).json({ message: "All the fields are required" });
    }

    //find the existing
    const existingProject = await Project.findByPk(id);
    if (!existingProject) {
      return res.status(400).json({ message: "This project doesn't exist" });
    }

    //find duplicates
    const duplicates = await Project.findOne({
      where: {
        project_name,
      },
    });

    if (duplicates && duplicates.id.toString() !== id.toString()) {
      return res
        .status(409)
        .json({ message: "duplicates project: same username" });
    }

    existingProject.project_banner = project_banner;

    existingProject.project_description = project_description;

    existingProject.project_name = project_name;
    existingProject.project_remarks = project_remarks;
    existingProject.project_status = project_status;

    const updatedProject = await existingProject.save();
    if (updatedProject) res.json({ msg: `user successfully updated` });
  },

  //@desc delete a project
  //@route DELETE /projects
  //access Private
  deleteProject: async (req, res) => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "project Id required" });
    }

    //find existing
    const existingProject = await Project.findByPk(id);

    if (!existingProject) {
      return res
        .status(400)
        .json({ message: `The project with id ${id} doesn't exist` });
    }

    const deletedProject = await existingProject.destroy();

    if (deletedProject) {
      return res
        .status(201)
        .json({ message: `The project with id ${id} deleted successfully` });
    }
  },
};
