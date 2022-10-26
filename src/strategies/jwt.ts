import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import db from "../Database";
import config from "../config";

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("JWT_SECRET"),
        },
        async (payload, done) => {
            const accountQuery = await db.query(
                "SELECT id FROM account WHERE email=$1::text",
                [payload.email]
            );

            if (accountQuery.rowCount === 0) {
                done(null, false);
            }

            done(null, { email: payload.email });
        }
    )
);
