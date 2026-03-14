import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import db from "./utils/db.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://reportbackend.forese.co.in/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userEmail = profile.emails[0].value.toLowerCase();
        const result = await db.query(
          `SELECT u.*, r.aptitude, r.core, r.verbal, r.programming, r.comprehension, 
                  r.subject_knowledge, r.communication_skills, r.body_language, 
                  r.listening_skills, r.active_participation
           FROM "User" u
           LEFT JOIN "Result" r ON u.id = r."userId"
           WHERE u.email = $1`,
          [userEmail],
        );

        if (result.rows.length === 0) {
          return done(null, false, { message: "User not registered" });
        }

        const user = result.rows[0];
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

export default passport;
