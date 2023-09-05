const express = require("express");
require("express-async-error");
require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const root = require("./controllers");
const { logger } = require("./middleware/logger");
const cors = require("cors");
const corsOptions = require("./config/corsOptions.Js");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./models");

const PORT = process.env.PORT || 4000;
const app = express();

app.use(logger);
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/", require("./routes/root.routes"));
app.use("/members", require("./routes/member.route"));
// app.use("/tasks", require("./routes/task.route"));
// app.use("/project", require("./routes/project.route"));
// app.use("/updates", require("./routes/updates.routes"));
// app.use("/teams", require("./routes/team.routes"));
app.use("/auth", require("./routes/auth.route"));

app.all("*", root.noRoutes);
app.use(errorHandler);

(async () => {
  await db.sequelize
    .sync()
    .then(() => {
      console.log("database connected successfully");
    })
    .catch(function (error) {
      console.log("Failed to connect to MYSQL DATABASE", error);
    });
})();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
