const { Member, EmailAddress } = require("../models").models;
// require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const passport = require("passport");

module.exports = {
  googleRegister: asyncHandler(async (req, res) => {
    const { username, email, picture, id } = req.body;

    console.log({ username, email, picture });

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

    if (!duplicates) {
      console.log("already in the database");
      const registeredUser = await Member.create({
        username,
        picture: picture,
        googleId: id,
      });

      if (registeredUser) {
        console.log("creating email adrress");
        const newEmail = await EmailAddress.create({
          designation: email,
          provider: `from ${emailProvider} bearer`,
          projectManagerId: registeredUser.id,
        });

        if (newEmail) {
          console.log(newEmail);
        }
        console.log("emailProvider: ", emailProvider);

        console.log(registeredUser);
        return res.status(201).json({ ...registeredUser, email });
      }
    }

    duplicates.createdAt = `${
      new Date().toISOString().split("T")[0]
    } ${new Date().toISOString().split("T")[1].toString().slice(0, 8)}`;

    await duplicates.save();

    res.json({ email });
  }),

  //@desc register
  //@route POST /register
  //@access Public

  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    console.log({ username, email, password });

    if (!username || !email || !password) {
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

    const hashPwd = await bcrypt.hash(password, 10);

    const registeredUser = await Member.create({
      username,
      password: hashPwd,
    });
    const newEmail = await EmailAddress.build({
      designation: email,
      provider: `from ${emailProvider} bearer`,
      projectManagerId: registeredUser.id,
    });

    console.log("emailProvider: ", emailProvider);

    console.log(registeredUser);

    if (newEmail) {
      newEmail.save();

    console.log(newEmail);

    return res.status(201).json({ ...registeredUser, email });
    }

    res.status(500).json({ message: "registration failed" });
  }),

  //@desc Login
  //@route POST /auth
  //@access Public
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    console.log("\n\n" + { email, password } + "\n\n");

    if (!email || !password) {
      return res.status(400).json({ message: "All the fields are required" });
    }
    //req.session.user = req.body;

    const existingEmail = await EmailAddress.findOne({
      where: {
        designation: email,
      },
    });

    console.log("\n");
    console.log({ foundUserID: existingEmail.projectMemberId });

    if (!existingEmail) {
      console.log("%c not existing emailaddress: UnAuthorized", "tomato");

      return res.status(401).json({ message: "UnAuthorized!" });
    }

    //look for the person owner of that email
    const foundUser = await Member.findByPk(existingEmail.projectManagerId);

    console.log('\n\n');
    console.log({ foundUser });
    console.log("\n\n");

    //* is active is usefull to deactivate/remove a user from the app project
    if (!foundUser || !foundUser.isActive) {
      console.log("%c not existing emailOwner: UnAuthorized", "tomato");

      return res.status(401).json({ message: "UnAuthorized!" });
    }

    const matchUser = await bcrypt.compare(password, foundUser.password);

    if (!matchUser) {
      console.log(
        "%c\n not emailOwner with password: UnAuthorized\n",
        "tomato"
      );

      return res.status(401).json({ message: " UnAuthorized" });
    }

    const userInfo = {
      username: foundUser?.username,
      roles: foundUser?.role,
      email: email,
    };

    console.log({ userInfo });

    //*create token
    const accessToken = jwt.sign(
      {
        userInfo,
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

    res.json({ accessToken, refreshToken });
  }),

  googleLogin: asyncHandler(async (req, res) => {
    const { email } = req.body;

    console.log("\n\nemail");
    console.log({ email });

    if (!email) {
      return res.status(400).json({ message: "email required" });
    }

    const existingEmail = await EmailAddress.findOne({
      where: {
        designation: email,
      },
    });
    console.log("\n\nexistingEmail");
    console.log({ existingEmail });

    console.log("\n\nfoundUserID");
    console.log({ foundUserID: existingEmail.projectManagerId });

    //look for the person owner of that email
    const foundUser = await Member.findByPk(existingEmail.projectManagerId);

    console.log("\n\nfoundUser");
    console.log({ foundUser });

    const userInfo = {
      username: foundUser?.username,
      roles: foundUser?.role,
      email: email,
      picture: foundUser?.picture,
    };

    console.log("\n\nuserInfo for the token ");
    console.log({ userInfo });

    //*create token
    const accessToken = jwt.sign(
      {
        userInfo,
      },
      process.env.ACCESS_TOKEN_SECRETKEY,
      {
        expiresIn: "15m",
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

    //this is for web app only
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken, refreshToken });
  }),

  //@desc Logout
  //@route POST /auth/logout
  //@access Public
  logout: asyncHandler(async (req, res, next) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      return res.status(204);
    }

    // res.clearCookie("jwt", {
    //   httpOnly: true,
    //   sameSite: "None",
    //   secure: true,
    // });

    const accessToken = '', refreshToken = '';

    res.json({
      message: "cookie cleared successfully",
      accessToken,
      refreshToken,
    });
  }),

  //@desc Refresh
  //@route Get /auth/refresh
  //@access Public
  refresh: asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    console.log("in the refresh controller", authHeader);
    
 console.log("in the refresh before authHeader check");
    if (!authHeader?.startsWith("Bearer")) {
      return res.status(401).send("UnAuthorized. no start with bearer");
    }

     console.log("in the refresh after authHeader check");

    const refreshToken = authHeader.split(" ")[1];
   

    console.log('\n\n ');
    console.log("refreshToken", refreshToken);
     console.log("\n");

    if (!refreshToken) {
      return res.status(401).json({ message: "UnAuthorized. no refresh token" });
    }


    console.log("before verify");
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRETKEY,
      async (err, decodedUserInfo) => {
        if (err) {
          return res.status(403).json({ message: "Forbidden" });
        }

        const foundUser = await Member.findOne({
          where: { 
            username: decodedUserInfo.username,
          },
        });

        console.log('\n\n in the refresh')
        console.log(foundUser);

        if (!foundUser) {
          return res
            .status(404)
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
            expiresIn: "15m",
          }
        );
console.log("in the refresh verify");
        res.json({ accessToken });
      }
    );
    console.log("after  the refreh verify");
  }),
};
