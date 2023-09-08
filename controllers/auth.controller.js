const {Member} = require("../models").models;
// require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler')

module.exports = {
  //@desc Login
  //@route POST /auth
  //@access Public
  login: asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All the fields are required" });
    }

    const foundUser = await Member.findOne({
      where: {
        project_member_username: username,
      },
    });

    if (!foundUser || !foundUser.project_member_active) {
      return res.status(401).json({ message: "User not found: UnAuthorized" });
    }

    const matchUser = await bcrypt.compare(
      password,
      foundUser.project_member_password
    );

    if (!matchUser) {
      return res.status(401).json({ message: "NO match: UnAuthorized" });
    }

    //*create token
    const accessToken = jwt.sign(
      {
        userInfo: {
          username: foundUser.project_member_username,
          roles: foundUser.project_member_role,
        },
      },
      process.env.ACCESS_TOKEN_SECRETKEY,
      {
        expiresIn: "15s",
      }
    );

    //*create refresh token
    const refreshToken = jwt.sign(
      {
        username: foundUser.project_member_username,
      },
      process.env.REFRESH_TOKEN_SECRETKEY,
      {
        expiresIn: "15s",
      }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 60 * 60 * 1000,
    });

    res.json({ accessToken });
  }),

  //@desc Logout
  //@route POST /auth/logout
  //@access Public
  logout: asyncHandler(async (req, res, next) => {

    const cookies = req.cookies;

    if(!cookies?.jwt) {
      return res.status(204);
    }

    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'None',
      secure: true
    });

    res.json({message: 'cookie cleared successfully'});
  }),

  //@desc Refresh
  //@route Get /auth/refresh
  //@access Public
  refresh: asyncHandler(async (req, res, next) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      return res.status(401).json({ message: "No jwt : UnAuthorized" });
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
            project_member_username: decodedUserInfo.username,
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
              username: foundUser.project_member_username,
              roles: foundUser.project_member_role,
            },
          },
          process.env.ACCESS_TOKEN_SECRETKEY,
          {
            expiresIn: "20m",
          }
        );

        res.json({ accessToken });
      }
    );
  }),
};
