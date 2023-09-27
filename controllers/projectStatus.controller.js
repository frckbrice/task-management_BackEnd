const { ProjectStatus, Project, Task } = require("../models").models;

const asyncHandler = require("express-async-handler");

module.exports = {
  //@desc get All ProjectStatus
  //@route GET /ProjectStatus
  //access Private

  getAllProjectStatus: asyncHandler(async (req, res) => {
    // const projectStages = await ProjectStatus.findAll();

    // if (!projectStages.length)
    //   return res.status(404).json({ message: "status not found" });

    // res.status(201).json(projectStages);

    const { id } = req.body;

    console.log("\n\n in the get project Status");
    console.log(id);

    if (!id) return res.status(400).json({ message: " project Id is needed" });

    const targetProject = await Project.findByPk(id);

    const statuses = await ProjectStatus.findAll({
      where: {
        projectId: id,
      },
      include: [Task],
    });
    console.log("\n\nstatuses");
    console.log(statuses);

    console.log("\n\n");
    console.log({ statuses }, { targetProject });

    if (!statuses)
      return res
        .status(400)
        .json({ message: "No task statuses created yet for this project" });

    const formatedStatuses = statuses?.map((status) => {
      return {
        [status.id]: {
          task_status: status.designation,
          tasks: status.tasks,
        },
      };
    });

    res.json({
      message: `List of statuses associated to project${targetProject.name}`,
      formatedStatuses,
    });
  }),

  //@desc create projectStatus
  //@route POST /projectStatuss
  //access private
  createProjectStatus: asyncHandler(async (req, res) => {
    const { designation, projectId } = req.body;

    console.log("\n\n in the create project Status");
    console.log("\n\n", { designation, projectId });

    if (!designation || !projectId) {
      return res.json({ message: "All fields are required" });
    }

    const duplicates = await ProjectStatus.findOne({
      where: {
        designation,
        projectId,
      },
    });

    console.log("\n\nduplicates in projectStatus\n\n", duplicates);

    if (duplicates) {
      console.log("\n\nduplicates", duplicates);
      return res.status(409).json({ message: `${designation} already exists` });
    }

    const uniformProjectStatus = {
      designation,
      projectId,
    };

    ProjectStatus.create(uniformProjectStatus)
      .then((status) => {
        if (status) {
          console.log("\n\nstatus of task created successfully", status);
          return res.status(201).json({
            message: `The projectStatus ${designation} successfully created`,
            status,
          });
        }
      })
      .catch(function (error) {
        console.log("Error creating project Status column", error);
        return res
          .status(400)
          .json({ message: "Failed to create projectStatus" });
      });
  }),

  //@desc update a projectStatus
  //@route PATCH /projectStatus
  //access Private
  updateProjectStatus: asyncHandler(async (req, res) => {
    const { designation, color, positionInTheList } = req.body;

    if (!id || !designation || !color || !positionInTheList) {
      return res.status(400).json({ message: "All the fields are required" });
    }

    //find the existing
    const existingProjectStatus = await ProjectStatus.findByPk(id);
    if (!existingProjectStatus) {
      return res
        .status(400)
        .json({ message: "This projectStatus doesn't exist" });
    }

    //find duplicates
    const duplicates = await ProjectStatus.findOne({
      where: {
        designation,
      },
    });

    if (duplicates && duplicates.id.toString() !== id.toString()) {
      console.log(duplicates);
      return res
        .status(409)
        .json({ message: "duplicates projectStatus: same projectStatus name" });
    }

    existingProjectStatus.designation = designation;

    existingProjectStatus.color = color;
    existingProjectStatus.positionInTheList = positionInTheList;

    const updatedProjectStatus = await existingProjectStatus.save();
    if (updatedProjectStatus) res.json({ msg: `user successfully updated` });
  }),

  //@desc delete a projectStatus
  //@route DELETE /projectStatus
  //access Private
  deleteProjectStatus: asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "projectStatus Id required" });
    }

    //find existing
    const existingProjectStatus = await ProjectStatus.findByPk(id);

    if (!existingProjectStatus) {
      return res
        .status(400)
        .json({ message: `The projectStatus with id ${id} doesn't exist` });
    }

    const deletedProjectStatus = await existingProjectStatus.destroy();

    if (deletedProjectStatus) {
      return res.status(201).json({
        message: `The projectStatus with id ${id} deleted successfully`,
      });
    }
  }),
};
