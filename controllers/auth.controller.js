const {Member, EmailAddress} = require("../models").models;
// require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler');
const passport = require('passport');

module.exports = {
  //@desc register
  //@route POST /register
  //@access Public

  register: asyncHandler(async(req, res) => {
      const {username, email, password, picture, id} = req.body;

    console.log({ username, email, password,  picture });

      if(!username || !email) {
        return res.status(400).json({message: 'All fields are required'});
      }

      const duplicates = await EmailAddress.findOne({
        where: {
          designation: email,
        },
      });

       const provider = email.split("@")[1].split('.')[0];
      if(duplicates){
        return res.status(409).json({message:'this email is already in use'});
      }
      if(password) {
        const hashPwd = await bcrypt.hash(password, 10);
      }

      const registeredUser = await Member.create({
        username,
        password: password ? hashPwd : '',
        isActive: true,
        picture: picture ? picture: '',
        googleId: id ? id: '',
      });

      if(registeredUser) {
        await EmailAddress.create({
          designation: email,
          provider,
          projectMemberId: registeredUser.id,
        });

        res.status(201).json(registeredUser,  email);
      }
        
  }),

  //@desc Login
  //@route POST /auth
  //@access Public
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All the fields are required" });
    }

    const existingEmail = await EmailAddress.findOne({
      where: {
        designation: email,
      },
    });

    if (!existingEmail) {
      return res
        .status(401)
        .json({ message: "User with this email not found: UnAuthorized!" });
    }

    const foundUser = Member.findById(existingEmail.projectMemberId);

    //* is active is usefull to deactivate/remove a user from the app project
    if(!foundUser || !foundUser.isActive) {
      return res
        .status(401)
        .json({ message: "User not found or inactive: UnAuthorized!" });
    }

    const matchUser = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (!matchUser) {
      return res.status(401).json({ message: "NO match: UnAuthorized" });
    }

    //*create token
    const accessToken = jwt.sign(
      {
        userInfo: {
          username: foundUser.username,
          roles: foundUser.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRETKEY,
      {
        expiresIn: "1m",
      }
    );

    //*create refresh token
    const refreshToken = jwt.sign(
      {
        username: foundUser.username,
      },
      process.env.REFRESH_TOKEN_SECRETKEY,
      {
        expiresIn: "1m",
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
            expiresIn: "1m",
          }
        );

        res.json({ accessToken });
      }
    );
  }),
};
