const { Project, Member, Team, Task, EmailAddress } =
  require("../models").models;
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
        return res.status(400).json({ message: "No projects found" });
      res.json(data);
    });
  },

  //@desc get all project members
  //@route GET /project/members
  //access Private
  getProjectMembers: async (req, res) => {
    // get the id of the project
    const { id } = req.body;

    if (!id) return res.status(400).json({ message: " Id is needed" });

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
        attributes: ["username"],
        raw: true,
      })
    ).map((member) => member.username);

    if (!projectMember.length)
      return res
        .status(404)
        .json({ message: "This project's team doesn't have members" });

    res.json({
      message: `List of member associated to project${targetProject.name}`,
      projectMember,
    });
  },

  //@desc create project
  //@route POST /project
  //access private
  createProject: async (req, res) => {
    const { name, description, banner, startDate, estimateEndDate, remarks, teamName } =
      req.body;

    // const { email } = req.user;

    if (!name || !description || !estimateEndDate || !startDate) {
      return res.json({ message: "All fields are required" });
    }

    console.log({user: req.user})

   const existingEmail = await EmailAddress.findOne({
        where: {
          designation: req.user,
        },
      });
    
console.log({ pm:existingEmail.projectMemberId });
    const duplicates = await Project.findOne({
      where: {
        name,
      },
    });

    if (duplicates) {
      console.log({duplicates});
      return res.status(409).json({ message: `${name} already exists` });
    }

    let  pmId  = existingEmail.projectManagerId;

    const uniformProject = {
      name,
      description,
      banner,
      startDate,
      estimateEndDate,
      remarks,
    };

    Project.create({ ...uniformProject, projectManagerId: pmId }).then(async(data) => {
      if (data) {
        console.log(data);

        // we create also a team that handle a project 
        const newTeam = await Team.create({
          name: teamName,
          projectId: data.id 
          
        })

        if(newTeam) {
          console.log('\n\n team also created successfully');

          return res.status(201).json({
            message: `The project ${name} successfully created`,
            data,
          });
        }

        
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
      name,
      description,
      banner,
      completed,
      remarks,
      projectProgress,
    } = req.body;

    if (!id || !name || !projectProgress || !remarks) {
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
        name,
      },
    });

    if (duplicates && duplicates.id.toString() !== id.toString()) {
      return res
        .status(409)
        .json({ message: "duplicates project: same username" });
    }

    existingProject.banner = banner;

    existingProject.description = description;

    existingProject.name = name;
    existingProject.remarks = remarks;
    existingProject.projectProgress = projectProgress;

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
