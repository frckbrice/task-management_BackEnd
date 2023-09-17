const {ProjectStatus, Project} = require('../models').models;

const asyncHandler = require("express-async-handler")


module.exports = {
  //@desc get All ProjectStatus
  //@route GET /ProjectStatus
  //access Private

  getAllProjectStatus: asyncHandler(async (req, res) => {
    const projectStages = await ProjectStatus.findAll();

    if (!projectStages.length)
      return res.status(404).json({ message: "status not found" });

    res.status(201).json(projectStages);
  }),

  //@desc create projectStatus
  //@route POST /projectStatuss
  //access private
  createProjectStatus: async (req, res) => {
    const { designation, color, positionInTheList } = req.body;

    if (!designation || !color) {
      return res.json({ message: "All fields are required" });
    }

    const duplicates = await ProjectStatus.findOne({
      where: {
        designation,
      },
    });

    if (duplicates) {
      console.log(duplicates);
      return res.status(409).json({ message: `${designation} already exists` });
    }

    const uniformProjectStatus = {
      designation,
      color,
      positionInTheList,
    };

    ProjectStatus.create(uniformProjectStatus).then((data) => {
      if (data) {
        console.log(data);
        res.status(201).json({
          message: `The projectStatus ${designation} successfully created`,
          data,
        });
      } else {
        return res.json({ message: "Failed to create projectStatus" });
      }
    });
  },

  //@desc update a projectStatus
  //@route PATCH /projectStatus
  //access Private
  updateProjectStatus: async (req, res) => {
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
  },

  //@desc delete a projectStatus
  //@route DELETE /projectStatus
  //access Private
  deleteProjectStatus: async (req, res) => {
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
  },
};