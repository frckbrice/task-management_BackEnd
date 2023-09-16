const { Member, EmailAddress } = require("../models").models;
// require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const passport = require("passport");

module.exports = {
  //@desc register
  //@route POST /register
  //@access Public

  register: asyncHandler(async (req, res) => {
    const { username, email, password, picture, id } = req.body;

    console.log({ username, email, password, picture });

    if (!username || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const duplicates = await EmailAddress.findOne({
      where: {
        designation: email,
      },
    });

    const emailProvider = email.split("@")[1].split(".")[0];

    console.log("emailProvider: ", emailProvider);

    if (duplicates) {
      return res.status(409).json({ message: "this email is already in use" });
    }

    let hashPwd;
    if (password) {
      hashPwd = await bcrypt.hash(password, 10);
    }

    let registeredUser = await Member.create({
      username,
      password: password ? hashPwd : "",
      isActive: true,
      picture: picture ? picture : "",
      googleId: id ? id : "",
    });

    if (registeredUser) {
      const newEmail = await EmailAddress.create({
        designation: email,
        provider: `from ${emailProvider} provider`,
        projectMemberId: registeredUser.id,
      });

      if (newEmail) {
        console.log(newEmail);
      }
      console.log("emailProvider: ", emailProvider);

      console.log(registeredUser);
      res.status(201).json({ ...registeredUser, email });
    }
  }),

  //@desc Login
  //@route POST /auth
  //@access Public
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email) {
      return res.status(400).json({ message: "All the fields are required" });
    }

    const existingEmail = await EmailAddress.findOne({
      where: {
        designation: email,
      },
    });

    console.log("existingEmail: ", existingEmail);

    if (!existingEmail) {
      console.log("%c not existing emailaddress: UnAuthorized", "tomato");
      return res
        .status(401)
        .json({ message: "User with this email not found: UnAuthorized!" });
    }

    //look for the person owner of that email
    const foundUser = await Member.findByPk(existingEmail.projectMemberId);
    console.log("found user: ", foundUser);
    //* is active is usefull to deactivate/remove a user from the app project
    if (!foundUser || !foundUser.isActive) {
      console.log("%c not existing emailOwner: UnAuthorized", "tomato");
      return res
        .status(401)
        .json({ message: "User not found or inactive: UnAuthorized!" });
    }

    let matchUser;
    if (password) {
      matchUser = await bcrypt.compare(password, foundUser.password);
      console.log("%c\n not emailOwner with password: UnAuthorized\n", "tomato");
      if (!matchUser) {
        return res.status(401).json({ message: "NO match: UnAuthorized" });
      }
    }

    //*create token
    const accessToken = jwt.sign(
      {
        userInfo: {
          username: foundUser.username,
          roles: foundUser.role,
          email: email,
          picture: foundUser.picture
        },
      },
      process.env.ACCESS_TOKEN_SECRETKEY,
      {
        expiresIn: "20m",
      }
    );

    //*create refresh token on backend
    const refreshToken = jwt.sign(
      {
        username: foundUser.username,
      },
      process.env.REFRESH_TOKEN_SECRETKEY,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      // secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  }),

  //@desc Logout
  //@route POST /auth/logout
  //@access Public
  logout: asyncHandler(async (req, res, next) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      return res.status(204);
    }

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    res.json({ message: "cookie cleared successfully" });
  }),

  //@desc Refresh
  //@route Get /auth/refresh
  //@access Public
  refresh: asyncHandler(async (req, res, next) => {
    const cookies = req.cookies;

    console.log(cookies);
    console.log(cookies?.jwt);

    if (!cookies?.jwt) {
      return res
        .status(401)
        .json({ message: "No cookie in the header : UnAuthorized" });
    }

    const refreshToken = cookies.jwt;

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRETKEY,
      async (err, decodedUserInfo) => {
        if (err) {
          return res.status(403).json({ message: "refresh Forbidden" });
        }

        const foundUser = await Member.findOne({
          where: {
            username: decodedUserInfo.username,
          },
        });

        if (!foundUser) {
          return res
            .status(401)
            .json({ message: "No user found for refresh. UnAuthorized" });
        }

        const accessToken = jwt.sign(
          {
            userInfo: {
              username: foundUser.username,
              roles: foundUser.role,
            },
          },
          process.env.ACCESS_TOKEN_SECRETKEY,
          {
            dexpiresIn: "20m",
          }
        );

        res.json({ accessToken });
      }
    );
  }),
};
