const passport = require("passport");

const passportJwt = require("passport-jwt");
const { where } = require("sequelize");
const { ExtractJwt } = passportJwt;
const StrategyJwt = passportJwt.Strategy;
require("dotenv").config();

const { Member } = require("../models").models;

passport.use(
  new StrategyJwt(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        "8a21a81ed494fb855e95a26ebc4094558952901de5a5563cc622a0e518349f32dd7a2e34d8f3a9880c478675d05f0c54f798efc47fdbaa8a338b02ba2001dcb3",
    },
    (jwtPayload, done) => {
      console.log(jwtPayload);
      console.log(process.env.JWT_SECRET);
      return Member.findOne({
        where: {
          id: jwtPayload.id,
        },
      })
        .then((member) => done(null, member))
        .catch((err) => done(err));
    }
  )
);
