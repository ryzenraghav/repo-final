import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user, info) => {
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

      if (err) {
        console.error("Google Auth Error:", err);
        return res.redirect(`${clientUrl}/?error=Authentication failed`);
      }
      if (!user) {
        return res.redirect(`${clientUrl}/?error=User not registered`);
      }

      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.redirect(
        `${clientUrl}/oauth-success?token=${token}`
      );
    })(req, res, next);
  }
);

export default router;
