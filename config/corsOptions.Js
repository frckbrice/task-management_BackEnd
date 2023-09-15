const { allowedOrigin } = require("./allowedOrigin");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigin.includes(origin) || !origin) {
      // no origin because of postman/thunder testers
      callback(null, true);
    } else {
      callback(new Error("NOT ALLOW BECAUSE OF CORS"));
    }
  },
  Credentials: true,
  optionSuccessStatus: 200,
  allowCredentials : true,
};

module.exports = corsOptions;
