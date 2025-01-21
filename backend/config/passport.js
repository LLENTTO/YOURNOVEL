import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import userSchema from "../schemas/userSchema.js"
import dotenv from "dotenv"

dotenv.config()

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userSchema.findOne({googleId: profile.id})
                
                if (!user) {
                    user = new userSchema({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value,
                        accessToken,
                        refreshToken
                    })
                    user.accessToken = accessToken
                    await user.save();
                }
                done (null, user)
            } catch (error) {
                done(error, null)
            }
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    const user = await userSchema.findById(id);
    done(null, user)
})