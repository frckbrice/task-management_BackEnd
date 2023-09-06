const { Task, Member, Team, Project, Updates } = require("../models").models;
const { Op } = require("sequelize");

const bcrypt = require("bcrypt");

module.exports = {
  //@desc get all updates
  //@route GET /updates
  //access Private

  getAllUpdates: async (req, res) => {
    Updates.findAll().then((data) => {
      console.log(data);
      if (!data.length)
        return res.status(400).json({ message: "No update found" });
      res.json(data);
    });
  },

  //@desc create update
  //@route POST /updates
  //access private
  createUpdate: async (req, res) => {
    const {
      task_update_action,
      update_description,
      task_update_remarks,
    } = req.body;

    if (
      !task_update_action ||
      !update_description ||
      !task_update_remarks
    ) {
      return res.json({ message: "All fields are required" });
    }

    const uniformUpdate = {
      task_update_action,
      update_description,
      task_update_remarks,
    };

    Updates.create(uniformUpdate).then((data) => {
      if (data) {
        console.log(data);
        res.status(201).json({
          message: `The update ${update_name} successfully created`,
          data,
        });
      } else {
        return res.json({ message: "Failed to create update" });
      }
    });
  },

  //@desc update a update
  //@route PATCH /updates
  //access Private
  updateUpdate: async (req, res) => {
    const {
      id,
      task_update_action,
      task_update_description,
      task_update_remarks,
    } = req.body;

    if (
      !id ||
      !task_update_action ||
      !task_update_description ||
      !task_update_remarks
    ) {
      return res.status(400).json({ message: "All the fields are required" });
    }

    //find the existing
    const existingUpdate = await Updates.findByPk(id);
    if (!existingUpdate) {
      return res.status(400).json({ message: "This update doesn't exist" });
    }

    // //find duplicates
    // const duplicates = await Updates.findOne({
    //   where: {
    //     update_name,
    //   },
    // });

    // if (duplicates && duplicates.id.toString() !== id.toString()) {
    //   console.log(duplicates);
    //   return res
    //     .status(409)
    //     .json({ message: "duplicates update: same update name" });
    // }

    existingUpdate.task_update_action = task_update_action;

    existingUpdate.task_update_description = task_update_description;
    existingUpdate.task_update_remarks = task_update_remarks;

    const updatedUpdate = await existingUpdate.save();
    if (updatedUpdate) res.json({ msg: `user successfully updated` });
  },

  //@desc delete a update
  //@route DELETE /updates
  //access Private
  deleteUpdate: async (req, res) => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "update Id required" });
    }

    //find existing
    const existingUpdate = await Updates.findByPk(id);

    if (!existingUpdate) {
      return res
        .status(400)
        .json({ message: `The update with id ${id} doesn't exist` });
    }

    const deletedUpdate = await existingUpdate.destroy();

    if (deletedUpdate) {
      return res
        .status(201)
        .json({ message: `The update with id ${id} deleted successfully` });
    }
  },
};
