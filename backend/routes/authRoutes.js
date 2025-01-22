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

authRouter.get("/check", (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth", error)
        res.status(500).json({message: "Failed checking auth"})
    }
})

export default authRouter;