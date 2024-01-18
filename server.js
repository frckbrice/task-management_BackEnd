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

const PORT = process.env.PORT || 4000;
const app = express();

app.use(logger);
app.use(cors(corsOptions));

app.set("trust proxy", 1);

app.use(
  express.json({
    type: ["application/json", "text/plain"],
  })
);
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
app.use("/invitation", require("./routes/invitation.route"));
app.use("/projectstatus", require("./routes/projectstatus.route"));

app.all("*", root.noRoutes);
app.use(errorHandler);

(async () => {
  await db.sequelize
    .sync({ alter: true })
    .then(() => {
      console.log("\n\ndatabase connected successfully\n\n");
    })
    .catch(function (err) {
      console.log("\n\nFailed to connect to MYSQL DATABASE\n\n", err);
      logEvents(
        `${err.no}:${err.message}\t${err.syscall}\t${err.hostname}`,
        "sequelErrLog.log"
      );
    });
})();
app.listen(PORT, () => console.log(`\nServer running on port ${PORT}\n`));
