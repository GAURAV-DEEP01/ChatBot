import "dotenv/config";
import express from "express";
import cors from "cors";
import { chatRoute } from "./api";

const app = express();
const port = Number(process.env.PORT) || 9090;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (_, res) => {
    res.json({ msg: "Use '/chat' route to chat with AI" });
});

app.post("/chat", chatRoute);

app.all("*", (_, res) => {
    res.status(404).json({ success: false, msg: "Invalid route" });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
