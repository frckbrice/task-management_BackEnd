const passport = require("passport");
const asyncHandler = require("express-async-handler");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { Member } = require("../models").models;

const GOOGLE_CALLBACK_URL = "http://localhost:5000/auth/google/callback";

passport.use(
  new GoogleStrategy( // Password123#@!
    {
      clientID: "406422802452-7hvk8l96vt3p0vv7o90ho5lihpgmpg34.apps.googleusercontent.com",
      clientSecret: "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",
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
