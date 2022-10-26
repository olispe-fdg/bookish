import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import db from "../db/db";
import config from "../config";
import { Account } from "../db/Account";

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("JWT_SECRET"),
        },
        async (payload, done) => {
            const account = await Account.findOne({
                where: {
                    email: payload.email,
                },
            });

            if (!account) {
                done(null, false);
            }

            done(null, { email: payload.email });
        }
    )
);
