import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js"
import router from "./routes/routes.js"
import  session  from "express-session"
import passport from "passport"
import MongoStore from "connect-mongo"
import "./config/passport.js"
import authRouter from "./routes/authRoutes.js"

dotenv.config()

const app = express()

app.use(express.json())
app.use(session({
    secret: process.env.CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions'
    }),
    cookie: {maxAge: 1000 * 60 *60 * 24} //1 day
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRouter)

app.use("/", router)

app.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/google");
  }
    res.send(`<h1>Welcome, ${req.user.displayName}</h1>`);
    console.log("Connection successful")
});

app.listen(process.env.PORT, () => {
    console.log(`App runs on port: ${process.env.PORT}`)
    connectDB()
})