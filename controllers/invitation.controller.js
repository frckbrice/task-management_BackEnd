const { Task, Member, Invitation, Project, EmailAddress, Team, TeamMember } =
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
    const { projectToken, emails, emailContent, emailDescription } = req.body;

    let subject;
    console.log("\n\n in the create invitation");
    console.log({ projectToken, emails, emailContent });

    if (!projectToken || !emails || !emailContent) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // look for the concerned project description
    const concernedProject = await Project.findByPk(projectToken);

    console.log("\n\n");
    console.log(concernedProject);

    if (!concernedProject)
      return res
        .status(400)
        .json({ message: `No project with this id ${projectToken}` });

    // const prjectsummary = concernedProject.description
    //   .toString()
    //   .substring(0, 100);

    const invitationContent =
      " You are requested to join the project called " + concernedProject.name;

    const projectname = concernedProject?.name;

    console.log("\n\nat the level of invitation creation");

    const newInvitation = await Invitation.create({
      projectId: projectToken,
      projectManagerId: concernedProject.projectManagerId,
      notified: true,
      content: invitationContent,
    }).catch((err) => console.log(err));

    console.log("\n\n after the level of invitation creation");

    console.log("\n\n");
    console.log(newInvitation);
    console.log("\n");

    if (newInvitation) {
      EmailAddress.create({
        invitationEmail: emails,
        invitationId: newInvitation.id,
      })
        .then((data) => {
          console.log("\n\nemails stored successfully\n");
        })
        .catch((err) => {
          console.log("\n\nFailed to store email\n", err);
        });
    }

    const newContent = `${emailContent}invitation/${newInvitation.id}`;
    // const newContent = `http://localhost:3000/invitation/${newInvitation.id}`;

    console.log(newContent);
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

    if (emailDescription) {
      subject = emailDescription;
    } else {
      subject = `INVITATION TO TAKE PART TO THE PROJECT ${projectname}`;
    }

    mailOptions = {
      from: "maebrie2017@gmail.com",
      to: emails,
      subject: subject,
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
    //* code to handle multiple email addresses
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
    const { name, contact, skills, accepted, invitationId } = req.body;

    console.log("\n\n", { name, contact, skills, accepted, invitationId });

    // fetch the invite for the token
    const existingInvitation = await Invitation.findByPk(invitationId);

    if (!existingInvitation) {
      console.log("this invitation doesn't exist");
      return res
        .status(401)
        .send({ message: " Invitation not valid. UnAuthorized" });
    }

    //check if the user is registered
    const inviteEmail = await EmailAddress.findOne({
      where: {
        invitationId,
      },
      // attributes: ["invitationEmail", "designation"],
    });

    console.log("\n\n");
    console.log({ inviteEmail });
    // if not invited redirect to register page
    if (!inviteEmail) {
      return res.json({
        message: "No valid email addresses for this invitation",
        location: `${process.env.FRONTEND_ADDRESS}`,
      });
    }

    if (inviteEmail && !accepted) {
      return res.json({
        message: "Thanks for your time. We hope you will accept next invite.",
      });
    }

    //if invited, check if it exists
    const registeredUserEmail = await EmailAddress.findOne({
      where: {
        designation: inviteEmail.invitationEmail,
      },
    });

    console.log("\n\n", { registeredUserEmail });

    if (!inviteEmail.invitationEmail) {
      return res.json({
        message: "No registered member for this invitation",
        location: `${process.env.FRONTEND_ADDRESS}/signup`,
      });
    }

    //if registerd,
    //check if the user is logged in
    const { email, userId } = req;
    if (!userId) {
      return res.json({
        message: "No logged in member for this invitation",
        location: `${process.env.FRONTEND_ADDRESS}/login`,
      });
    }
    //add the logged in user to the team of the project
    const concernedProject = await Project.findByPk(
      existingInvitation.projectId
    );

    console.log("\n\n", { concernedProject });

    if (!concernedProject) {
      return res.status(400).json({
        message: "No Project associated to this invitation",
      });
    }

    const member = await Member.findOne({
      where: {
        id: registeredUserEmail.projectManagerId,
      },
    });

    console.log("\n\n in the verify", member);

    if (!member) {
      return res.json({
        message: "No rgistered member for this invitation",
        location: `${process.env.FRONTEND_ADDRESS}/signup`,
      });
    }

    const projectTeam = await Team.findOne({
      where: {
        projectId: concernedProject.id,
      },
    });

    console.log("\n\n in the verify", projectTeam);

    if (!projectTeam) {
      return res.json({
        message: "No team for this project",
        location: `${process.env.FRONTEND_ADDRESS}`,
      });
    }

    member.contact = contact;
    member.skills = skills;
    member.name = name;
    await member.save();

    existingInvitation.accepted = accepted;
    await existingInvitation.save();

    registeredUserEmail.projectMemberId = member.id;
    await registeredUserEmail.save();

    const newMember = {
      projectMemberId: member.id,
      projectTeamId: projectTeam.id,
      memberRole: "invitee",
    };

    const newAdded = await Member.create(newMember);

    console.log("\n\n");
    console.log(newMember);

    if (!newAdded)
      return res.status(500).json({
        message: "Error creating team member role",
      });

    console.log("\n\n in the verify", { member });
    console.log("\n\n in the verify", { registeredUserEmail });
    console.log("\n\n in the verify", { existingInvitation });
    console.log("\n\n in the verify", { newAdded });

    return res.json({
      message: "Member added successfully to the project",
      location: `${process.env.FRONTEND_ADDRESS}/dashboard`,
    });
  }),

  handlenotifications: asyncHandler(async (req, res) => {
    const { email, userId } = req;

    console.log("\n\n");
    console.log("hit handlenotifications end");
    console.log({ email, userId });
    console.log("\n\n");

    // const targetEmail = await EmailAddress.findOne({
    //   where: {
    //     [Op.or]: {
    //       projectManagerId: targetUser.id,
    //       projectMemberId: targetUser.id,
    //     },
    //   },
    // });
    const targetEmail = await EmailAddress.findOne({
      where: {
        projectManagerId: userId,
      },
    });

    console.log("\n\n second targetEmail");
    console.log(targetEmail);

    if (!targetEmail) {
      return res.status(400).jsom({ message: "No such email for the user" });
    }

    const allInvitesWithTargetEmail = await EmailAddress.findAll({
      where: {
        invitationEmail: targetEmail.designation,
      },
    });

    console.log("\n\n allInvitesWithTargetEmail");
    console.log(allInvitesWithTargetEmail);

    const allInvitesIds = allInvitesWithTargetEmail?.map(
      (email) => email.invitationId
    );

    console.log("\n\n allInvitesIds");
    console.log(allInvitesIds);

    const invites = [];
    for (const inviteId of allInvitesIds) {
      const result = await Invitation.findOne({
        where: {
          [Op.and]: {
            id: inviteId,
            accepted: false,
          },
        },
      });
      if (result) invites.push(result);
    }

    console.log("\n\n invites");
    console.log(invites);

    if (!invites.length) {
      return res.status(400).json({ message: "No invitations" });
    }
    const notifications = invites?.map((invitation) => invitation.content);
    console.log(notifications);
    res.json(notifications);
  }),
};
