import express from 'express'
import passport from 'passport'

const authRouter = express.Router()

authRouter.get("/google", passport.authenticate('google', {
    scope: ['profile', 'email'],
}))

authRouter.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect("/dashboard")
    }
)

authRouter.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect('/');
    })
})

export default authRouter;