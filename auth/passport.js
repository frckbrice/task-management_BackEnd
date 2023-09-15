const passport = require("passport");

const passportJwt = require("passport-jwt");
const { where } = require("sequelize");
const { ExtractJwt } = passportJwt;
const StrategyJwt = passportJwt.Strategy;

const { Member } = require("../models").models;

passport.use(
  new StrategyJwt(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwtPayload, done) => {
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
