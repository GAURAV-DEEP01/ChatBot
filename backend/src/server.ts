import express from "express"; 
import dotenv from "dotenv";
const app = express();
dotenv.config();

const port = Number(process.env.PORT) || 9090;

app.get("/chat", (_, res)=>{
    res.send("test.... chating");
})

app.all("*",(_, res)=>{
    res.status(404).send({msg: "Invalid route"});
})

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
})