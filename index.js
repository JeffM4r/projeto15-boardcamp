import express from "express";
import cors from "cors";

const server = express();

server.use(cors());
server.use(express.json());

server.listen(4000, () => {
    console.log("something is happening on 4000")
})