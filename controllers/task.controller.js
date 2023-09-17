const { Task, Member, Team, Project, Updates } = require("../models").models;
const { Op } = require("sequelize");

const bcrypt = require("bcrypt");

module.exports = {
  //@desc get all task
  //@route GET /tasks
  //access Private

  getAllTask: async (req, res) => {
    Task.findAll().then((data) => {
      console.log(data);
      if (!data.length)
        return res.status(400).json({ message: "No task found" });
      res.json(data);
    });
  },

  //@desc create task
  //@route POST /tasks
  //access private
  createTask: async (req, res) => {
    const {
      name,
      description,
    
      startDate,
      remarks,
    } = req.body;

    if (!name || !description || !startDate) {
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
      startDate,
      remarks,
      
    };

    Task.create(uniformTask).then((data) => {
      if (data) {
        console.log(data);
        res.status(201).json({
          message: `The task ${name} successfully created`,
          data,
        });
      } else {
        return res.json({ message: "Failed to create task" });
      }
    });
  },

  //@desc update a task
  //@route PATCH /task
  //access Private
  updateTask: async (req, res) => {
    const {
      id,
      name,
      description,
      startDate,
      completed,
      remarks,
   
    } = req.body;

    if (
      !id ||
      !name ||
     
      !remarks ||
      (completed && !Boolean(completed)) || !description
    ) {
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
      },
    });

    if (duplicates && duplicates.id.toString() !== id.toString()) {
      console.log(duplicates)
      return res
        .status(409)
        .json({ message: "duplicates task: same task name" });
    }

   

    existingTask.description = description;

    existingTask.name = name;
    existingTask.remarks = remarks;
  
    existingTask.completed = completed;

    const updatedTask = await existingTask.save();
    if (updatedTask) res.json({ msg: `user successfully updated` });
  },

  //@desc delete a task
  //@route DELETE /task
  //access Private
  deleteTask: async (req, res) => {
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
  },
};
