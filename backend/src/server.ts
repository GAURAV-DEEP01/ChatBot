import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session"
import cors from "cors"

import { chatRoute } from "./api";
const app = express();

const port = Number(process.env.PORT) || 9090;

app.use(cors({
    origin: "*",
}))
app.use(express.json())
app.use(session({
    secret: "something",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000 * 60
    }
}));

app.post("/", (_, res) => {
    res.json({ msg: "Use '/chat' route to chat with AI" })
});

app.post("/chat", chatRoute)

app.all("*", (_, res) => {
    res.status(404).json({ success: false, msg: "Invalid route" });
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})