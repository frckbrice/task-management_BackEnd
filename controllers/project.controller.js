const { Project, Member, Team, Task, EmailAddress, Invitation, TeamMember } =
  require("../models").models;
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { sequelize } = require("../models");

module.exports = {
  //@desc get all project
  //@route GET /project
  //access Private

  getAllUserProject: asyncHandler(async (req, res) => {
    //get all projects for the authenticated user
    const email = req.email;
    let emailAuth;
    let user;
    if (email) {
      emailAuth = await EmailAddress.findOne({
        where: {
          designation: email,
        },
      });
      if (emailAuth) {
        Project.findAll({
          where: {
            projectManagerId: emailAuth.projectManagerId,
          },
        }).then((data) => {
          console.log({ project_data: data });
          if (!data.length) {
            return res.status(400).json({ message: "No projects found" });
          }
          res.json(data);
        });
      }
    } else if (req.user) {
      user = await Member.findOne({
        where: {
          username: req.user,
        },
      });
      Project.findAll({
        where: {
          projectManagerId: user.id,
        },
      }).then((data) => {
        console.log({ project_data: data });
        if (!data.length) {
          return res.status(400).json({ message: "No projects found" });
        }
        res.json(data);
      });
    } else {
      return res.redirect("http://localhost:3000/login");
    }
  }),

  //@desc get all project members
  //@route GET /project/members
  //access Private
  getProjectMembers: asyncHandler(async (req, res) => {
    // get the id of the project
    const { id } = req.body;

    console.log("\n\n in the get project members");
    console.log(id);

    if (!id) return res.status(400).json({ message: " project Id is needed" });

    const targetProject = await Project.findByPk(id);

    const teamOfProject = await Team.findOne({
      where: {
        projectId: id,
      },
    });

    if (!teamOfProject)
      return res.status(400).json({ message: "No Team for this project" });

    const projectMembers = await teamOfProject.getProjectMembers({
      attributes: {
        exludes : ['password']
      },
      joinTableAttributes: [],
    });
    console.log("\n\n" );
    console.log(projectMembers);
 

    console.log("\n\n");
    console.log({ teamOfProject, projectMembers, targetProject });

    if (!projectMembers)
      return res.status(400).json({ message: "No member for this project" });

    res.json({
      message: `List of member associated to project${targetProject.name}`,
      projectMembers,
    });
  }),

  //@desc create project
  //@route POST /project
  //access private
  createProject: async (req, res) => {
    const {
      name,
      description,
      banner,
      startDate,
      estimateEndDate,
      remarks,
      teamName,
    } = req.body;

    console.log("\n\n project info: ");
    console.log({
      name,
      description,
      banner,
      startDate,
      estimateEndDate,
      remarks,
      teamName,
    });

    console.log("\n\n");

    if (!name || !description || !estimateEndDate || !startDate || !teamName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const duplicates = await Project.findOne({
      where: {
        name,
      },
    });

    if (duplicates) {
      return res.status(409).json({ message: `${name} already exists` });
    }

    const uniformProject = {
      name,
      description,
      banner,
      startDate,
      estimateEndDate,
      remarks,
    };

    const email = req.email;
    const picture = req.picture;
    const username = req.user;
    console.log("\n\n");
    console.log({ email, picture, username });
    console.log("\n\n");
    let existingEmail;
    let pM;
    let pmId;
    if (email) {
      existingEmail = await EmailAddress.findOne({
        where: {
          designation: email,
        },
      });
      pmId = existingEmail.projectManagerId;
    } else if (username) {
      pM = await Member.findOne({
        where: {
          username,
        },
      });
      // console.log({pM});
      pmId = pM.id;
    }

    console.log("\n\n");
    console.log({ existingEmail, pmId });
    console.log("\n\n");

    Project.create({ ...uniformProject, projectManagerId: pmId })
      .then(async (data) => {
        if (data) {
          console.log("project creted successfully");
          console.log(data);

          // we create also a team that handle a project
          const newTeam = await Team.create({
            name: teamName,
            projectId: data.id,
          });

          if (newTeam) {
            console.log("\n\n team also created successfully", newTeam);

            console.log(
              "\n\nadding project Manager as default member of the project"
            );
            const member = await Member.findOne({
              id: pmId,
            });

            if (member) {
              const teamMember = await TeamMember.create({
                projectMemberId: member.id,
                projectTeamId: newTeam.id,
              });

              if (!teamMember)
                return res.status(500).json({
                  message: "Error creating team member role",
                });
            } else {
              return res.status(400).json({
                message:
                  "No manager for this project. Check what's goind wrong",
              });
            }

            return res.json({
              message: `The project ${name} successfully created`,
              data,
            });
          }
        }
      })
      .catch(function (error) {
        console.log("error creating a project", error);
        return res.status(500).json({
          message: `failed  to create a project`,
        });
      });
  },

  //@desc update a project
  //@route PATCH /projects
  //access Private
  updateProject: asyncHandler(async (req, res) => {
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
  }),

  //@desc delete a project
  //@route DELETE /projects
  //access Private
  deleteProject: asyncHandler(async (req, res) => {
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
  }),

  //@desc get all collaboration projects
  //@route GET /project/collaborations
  //access Private

  projectCollaborations: asyncHandler(async (req, res) => {
    // get all projects for the authenticated user
    const member = await Member.findOne({
      where: {
        username: req.user,
      },
    });

    if (!member) return res.status(500).json({ message: "Server Error" });

    const teamscollaborations = await member.getProjectTeams({
      where: {
        "$teamMember.memberRole$": "invitee",
      },
      include: [
        {
          model: Project,
        },
      ],
      joinTableAttributes: [],
    });

    if (!teamscollaborations.length) return res.status(204);

    //for each project retrieve the project in charge
    const projects = teamscollaborations?.map((team) => team.project);

    console.log("\n\n");
    console.log(teamscollaborations);
    console.log("\n\n");
    console.log(projects);

  
    return res.json(projects);

  }),
};
