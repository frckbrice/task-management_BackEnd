const passport = require("passport");
const asyncHandler = require("express-async-handler");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { Member } = require("../models").models;

const GOOGLE_CALLBACK_URL = "http://localhost:4000/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    asyncHandler(async (req, accessToken, refreshToken, profile, cb) => {
      const defaultMember = {
        name: `${profile.name.givenName} ${profile.name.familyName}`,
        username: profile.emails[0].value,
        picture: profile.photos[0].value,
        id: profile.id,
      };

      const user = await Member.findOrCreate({
        where: {
          id: profile.id,
        },
        default: defaultMember,
      });

      if (user && user[0]) return cb(null, user && user[0]);
    })
  )
);

passport.serializeUser((user, done) => {
  conslole.log("serializing user:", user);

  done(null, user.id);
});

passport.deserializeUser(
  asyncHandler(async (id, done) => {
    const user = await Member.findOne({
      where: {
        id,
      },
    });
    console.log("deserialized user", user);

    if (user) {
return done(null, user);
    }else {
      return done(null, false)
    }
    
  })
);
