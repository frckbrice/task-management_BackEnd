const { Task, Member, Team, Project } = require("../models").models;
const { Op } = require("sequelize");

const bcrypt = require("bcrypt");

module.exports = {
  //@desc get all team
  //@route GET /teams
  //access Private

  getAllTeam: async (req, res) => {
    Team.findAll().then((data) => {
      console.log(data);
      if (!data.length)
        return res.status(400).json({ message: "No team found" });
      res.json(data);
    });
  },

  //@desc create team
  //@route POST /team
  //access private
  createTeam: async (req, res) => {
    const { team_name, team_description, team_logo, team_color, team_status } =
      req.body;

    if (!team_name || !team_description || !team_status) {
      return res.json({ message: "All fields are required" });
    }

    const uniformTeam = {
      team_name,
      team_description,
      team_logo,
      team_color,
      team_status,
    };

    Team.create(uniformTeam).then((data) => {
      if (data) {
        console.log(data);
        res.status(201).json({
          message: `The team ${team_name} successfully created`,
          data,
        });
      } else {
        return res.json({ message: "Failed to create team" });
      }
    });
  },

  //@desc team a team
  //@route PATCH /teams
  //access Private
  teamTeam: async (req, res) => {
    const {
      id,
      team_name,
      team_description,
      team_logo,
      team_color,
      team_status,
    } = req.body;

    if (!team_name || !team_description || !team_status) {
      return res.status(400).json({ message: "All the fields are required" });
    }

    //find the existing
    const existingTeam = await Team.findByPk(id);
    if (!existingTeam) {
      return res.status(400).json({ message: "This team doesn't exist" });
    }

    //find duplicates
    const duplicates = await Team.findOne({
      where: {
        team_name,
      },
    });

    if (duplicates && duplicates.id.toString() !== id.toString()) {
      console.log(duplicates);
      return res
        .status(409)
        .json({ message: "This team name already exists" });
    }

    existingTeam.team_name = team_name;

    existingTeam.team_description = team_description;
    existingTeam.team_logo = team_logo;
    existingTeam.team_status = team_status;
    existingTeam.team_color = team_color;

    const teamdTeam = await existingTeam.save();
    if (teamdTeam) res.json({ msg: `user successfully teamd` });
  },

  //@desc delete a team
  //@route DELETE /team
  //access Private
  deleteTeam: async (req, res) => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "team Id required" });
    }

    //find existing
    const existingTeam = await Team.findByPk(id);

    if (!existingTeam) {
      return res
        .status(400)
        .json({ message: `The team with id ${id} doesn't exist` });
    }

    const deletedTeam = await existingTeam.destroy();

    if (deletedTeam) {
      return res
        .status(201)
        .json({ message: `The team with id ${id} deleted successfully` });
    }
  },
};
