const { Task, Member, Team, Project, Updates, TaskMember } =
  require("../models").models;
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");

module.exports = {
  //@desc get all task
  //@route GET /tasks
  //access Private

  getAllTask: asyncHandler(async (req, res) => {
    Task.findAll().then((data) => {
      console.log(data);
      if (!data.length)
        return res.status(400).json({ message: "No task found" });
      res.json(data);
    });
  }),

  //@desc create task
  //@route POST /tasks
  //access private
  createTaskOnboarding: asyncHandler(async (req, res) => {
    const { name, description, projectId } = req.body;

    console.log("\n\n");
    console.log({
      name,
      description,
      projectId,
    });
    console.log("\n");

    if (!name || !description || !projectId) {
      return res.json({ message: "All fields are required" });
    }

    const duplicates = await Task.findOne({
      where: {
        name,
      },
    });

    if (duplicates) {
      console.log(duplicates);
      return res.status(409).json({ message: `${name} already exists` });
    }

    const uniformTask = {
      name,
      description,
      projectId,
      projectStatusId: uuid(),
    };

    Task.create(uniformTask)
      .then((data) => {
        if (data) {
          console.log("\n\ndata from create task: ", data);
          res.status(201).json({
            message: `The task ${name} successfully created`,
            data,
          });
        } else {
          return res.json({ message: "Failed to create task" });
        }
      })
      .catch(function (error) {
        console.log("\n\nFailed to create task: ", error);
        return res.status(500).json({ message: "Failed to create task" });
      });
  }),

  createTask: asyncHandler(async (req, res) => {
    const { name, description, projectStatusId } = req.body;

    console.log("\n\n");
    console.log({
      name,
      description,
      projectStatusId,
    });
    console.log("\n");

    if (!name || !description || !projectStatusId) {
      return res.status(400).json({
        message:
          "All fields are required.Or You need to create the status column first",
      });
    }

    const duplicates = await Task.findOne({
      where: {
        name,
        projectStatusId,
      },
    });

    console.log("duplicates", duplicates);

    if (duplicates) {
      console.log("duplicates", duplicates);
      return res.status(409).json({ message: `${name} already exists` });
    }

    const uniformTask = {
      name,
      description,
      projectStatusId,
    };

    Task.create(uniformTask)
      .then((task) => {
        if (task) {
          console.log("\n\n task  created successfully", task);
          res.status(201).json({
            message: `The task ${name} successfully created`,
            task,
          });
        }
      })
      .catch(function (error) {
        console.log("\n\nFailed to create task: ", error);
        return res.status(500).json({ message: "Failed to create task" });
      });
  }),

  //@desc update a task
  //@route PATCH /task
  //access Private
  updateTask: asyncHandler(async (req, res) => {
    const { id, name, description, completed } = req.body;

    console.log("\n\n");
    console.log({ id, name, description, completed });

    if (!id || !name || !description || completed) {
      return res.status(400).json({ message: "All the fields are required" });
    }

    //find the existing
    const existingTask = await Task.findByPk(id);
    if (!existingTask) {
      return res.status(400).json({ message: "This task doesn't exist" });
    }

    //find duplicates
    const duplicates = await Task.findOne({
      where: {
        name,
        description,
      },
    });

    if (duplicates && duplicates.id.toString() !== id.toString()) {
      console.log(duplicates);
      return res.status(409).json({ message: "This task already exists" });
    }

    existingTask.description = description;

    existingTask.name = name;

    existingTask.completed = completed;

    const updatedTask = await existingTask.save();
    if (updatedTask)
      return res.json({ msg: `Task successfully updated`, updatedTask });
  }),

  //@desc delete a task
  //@route DELETE /task
  //access Private
  deleteTask: asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "task Id required" });
    }

    //find existing
    const existingTask = await Task.findByPk(id);

    if (!existingTask) {
      return res
        .status(400)
        .json({ message: `The task with id ${id} doesn't exist` });
    }

    const deletedTask = await existingTask.destroy();

    if (deletedTask) {
      return res
        .status(201)
        .json({ message: `The task with id ${id} deleted successfully` });
    }
  }),

  assignTaskTomember: asyncHandler(async (req, res) => {
    const { username, taskId } = req.body;

    console.log("\n\n in the assign task to member");
    console.log({ username, taskId });

    if (!username || !taskId) {
      return res.status(400).json({ message: "All the fields are required" });
    }

    const member = await Member.findOne({
      where: {
        username,
      },
    });

    if (!member) {
      return res.status(302).redirect(process.env.FRONTEND_ADDRESS + "/signup");
    }

    const assigment = await TaskMember.create({
      projectMemberId: member.id,
      taskId,
    });

    if (!assigment) return res.status(500).json({ message: "Server error" });

    res.json({
      message: `task successfully assigned to the member*${username} `,
      assigment,
    });
  }),
};
