const { Task, Member, Invitation, Project, EmailAddress } =
  require("../models").models;
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
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
    }).catch(err => console.log(err));

    console.log("\n\n after the level of invitation creation");

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

   const newContent = `${emailContent}invitation/${newInvitation.id}`;

console.log(newContent)
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
      text: `${prjectsummary} please click the following link to join the project ${newContent}`,
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

  //@desc handle invitation
  //@route GET /invitation/:id
  //@access private

  handleInvite: asyncHandler(async (req, res) => {
    const { id } = req.params;

    // fetch the invite for the token
    const existingInvitation = await Invitation.findByPk(id);

    if (!existingInvitation) {
      console.log("this invitation doesn't exist");
      return res.status(400).send({ message: " Invitation not valid" });
    }

    //check if the user is registered
    const inviteEmail = existingInvitation.invitationEmail;

    const dbEmail = EmailAddress.findOne({
      where: {
        designation: inviteEmail,
      },
    });

    if (!dbEmail){
      
      return res.redirect("http://localhost:3000/signup");
    } 

    //check if the user is logged in
    const cookies = req.cookies;

    console.log("\n\n");
    console.log(cookies);
console.log("\n\n");
    if (!cookies?.jwt) {
      
      return res.redirect("http://localhost:3000/login");
    }

    //add the logged in user to the team of the project

    const concernedProject = Project.findByPk(existingInvitation.projectId);

    if(!concernedProject) {
      return res.status(400).json({message:'Sorry, No Project to associate with'});
    }

    const refreshToken = cookies.jwt;
    // get the logged in user info
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRETKEY,
      async (err, rightuser) => {
        if (err) {
          return res.redirect("http://localhost:3000/login");
        }

        const member = Member.findOne({
          where: {
            username: rightuser.username,
          },
        });

        if (!member) {
           return res.redirect("http://localhost:3000/signup");
        }

        member.teamId = (await concernedProject.getTeam()).id;
        member.save();

        existingInvitation.accepted = true;
        existingInvitation.save();

        return res.redirect("http://localhost:3000/dashboard");
      }
    );
  }),
};
