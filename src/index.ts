import express from "express";

import dotenv from "dotenv";
dotenv.config();

import db from "./Database";

import { BookRoutes } from "./controllers";

const app = express();
app.use("/books", BookRoutes);

app.listen(8080, async () => {
    console.log("Starting server...");

    await db.connect();
});
