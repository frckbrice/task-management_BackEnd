const path = require("path");

module.exports = {
  index: (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "index.html"));
  },

  // if no routes found
  noRoutes: (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
      res.sendFile(path.join(__dirname, "..", "views", "404.html"));
    } else if (req.accepts("json")) {
      res.json({ message: "404, Page Not Found" });
    } else {
      res.type("text").send("404 Page Not Found");
    }
  },

  memberController: require("./member.controller"),
  authController: require("./auth.controller"),
  projectController: require('./project.controller'),
  taskController: require('./task.controller'),
  updatesController: require('./updates.controller'),
  teamController: require('./team.controller'),
  authController: require('./auth.controller'),
};