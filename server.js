const express = require("express");
require("express-async-error");
require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const root = require("./controllers");
const { logger, logEvents } = require("./middleware/logger");
const cors = require("cors");
const corsOptions = require("./config/corsOptions.Js");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./models");
const passport = require("passport");
const cookieSession = require('cookie-session')

const PORT = process.env.PORT || 4000;
const app = express();

app.use(logger);
app.use(cors(corsOptions));

require("./auth/passport");
require('./auth/passportGoogleSSO');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/", require("./routes/root.routes"));
app.use("/members", require("./routes/member.route"));
app.use("/tasks", require("./routes/task.route"));
app.use("/projects", require("./routes/project.route"));
app.use("/updates", require("./routes/updates.routes"));
app.use("/teams", require("./routes/team.routes"));
app.use("/auth", require("./routes/auth.route"));

app.use(
  require("express-session")({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// app.use(
//   cookieSession({
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: process.env.JWT_SECRET,
//   })
// );
app.use(passport.initialize());
app.use(passport.session());

app.all("*", root.noRoutes);
app.use(errorHandler);

(async () => {
  await db.sequelize
    .sync({ force: true })
    .then(() => {
      console.log("database connected successfully");
    })
    .catch(function (err) {
      console.log("Failed to connect to MYSQL DATABASE", err.message);
      logEvents(
        `${err.no}:${err.message}\t${err.syscall}\t${err.hostname}`,
        "sequelErrLog.log"
      );
    });
})();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
