const { Task, Member, Invitation, Project, EmailAddress } =
  require("../models").models;
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");

const asyncHandler = require("express-async-handler");

module.exports = {
  //@desc get all invitation
  //@route GET /invitations
  //access Private

  getAllInvitations: asyncHandler(async (req, res) => {
    Invitation.findAll().then((data) => {
      console.log(data);
      if (!data.length)
        return res.status(400).json({ message: "No invitation found" });
      res.json(data);
    });
  }),

  //@desc create invitation
  //@route POST /invitation
  //access private
  createInvitation: asyncHandler(async (req, res) => {
    const { token, emails, emailContent } = req.body;

    let inviteSent = false,
      returnResult;
    console.log("\n\n in the create invitation");
    console.log({ token, emails, emailContent });

    if (!token || !emails || !emailContent) {
      return res.json({ message: "All fields are required" });
    }

    // look for the concerned project description
    const concernedProject = await Project.findByPk(token);

    console.log("\n\n");
    console.log(concernedProject);

    if (!concernedProject)
      return res
        .status(400)
        .json({ message: `No project with this id ${token}` });

    const prjectsummary = concernedProject.description
      .toString()
      .substring(0, 100);

    const projectname = concernedProject?.name;

    console.log("\n\nat the level of invitation creation");

    const newInvitation = await Invitation.create({
      projectId: token,
      projectManagerId: concernedProject.projectManagerId,
      notified: true,
      content: emailContent,
      invitationEmail: emails,
    });
   console.log("\n\n after the level of invitation creation");
    const pmId = newInvitation.pr
    console.log("\n\n");
    console.log(newInvitation);
    console.log("\n");

    if (newInvitation) {
      EmailAddress.create({
        invitationEmail: emails,
      })
        .then((data) => {
          console.log("\n\nemails stored successfully\n");
        })
        .catch((err) => {
          console.log("\n\nfaile to store email\n", err);
        });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      // host: "smtp.google.com",
      // port: 465,
      // secure: true,
      auth: {
        user: "maebrie2017@gmail.com",
        pass: "agtfxvdodpmicruf",
      },
    });

    mailOptions = {
      from: "maebrie2017@gmail.com",
      to: emails,
      subject: `INVITATION TO TAKE PART TO THE PROJECT ${projectname}`,
      text: `${prjectsummary} please click the following link to join the project ${emailContent}`,
    };

    transporter.sendMail(mailOptions, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error sending mail" });
      } else {
        console.log("\n\nEmail sent! result: ", result.response);
        res.json({
          message: "Email successfully sent! ",
          result: result.response,
        });
      }
    });

    // if (newInvitation && emails.includes(","))
    // to create email array
    //   const emailArr = emails.split(",");
    //   emailArr.map((email) => {
    //     const newEmail = EmailAddress.build({
    //       invitationEmail: email,
    //     });

    //     newEmail
    //       .save()
    //       .then((data) => {
    //         console.log("\n\nemails stored\n");
    //       })
    //       .catch((err) => {
    //         console.log("\n\nfaile to store email\n");
    //       });
    //   });
    // } else if (emails.includes(",") === 0) {
  }),

  //@desc invitation a invitation
  //@route PATCH /invitations
  //access Private
  updateInvitation: asyncHandler(async (req, res) => {
    const { id, token, email, emailContent } = req.body;

    console.log("\n\n in the update invitation");
    console.log({ token, email, emailContent });

    if ((!id, !token || !email || !emailContent)) {
      return res.json({ message: "All fields are required" });
    }

    // find existing invitation
    const existingInvitation = await Invitation.findByPk(id);

    if (!existingInvitation)
      return res.status(400).json({ message: "No such invitation" });

    // existingInvitation.token =
  }),

  //@desc delete a invitation
  //@route DELETE /invitation
  //access Private
  deleteInvitation: asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "invitation Id required" });
    }

    //find existing
    const existingInvitation = await Invitation.findByPk(id);

    if (!existingInvitation) {
      return res
        .status(400)
        .json({ message: `The invitation with id ${id} doesn't exist` });
    }

    const deletedInvitation = await existingInvitation.destroy();

    if (deletedInvitation) {
      return res
        .status(201)
        .json({ message: `The invitation with id ${id} deleted successfully` });
    }
  }),
};
