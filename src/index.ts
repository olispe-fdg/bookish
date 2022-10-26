import express from "express";

import dotenv from "dotenv";
dotenv.config();

import db from "./Database";

async function main() {
    await db.connect();

    const response = await db.query("SELECT * FROM book");
    console.log(response);

    await db.end();
}

main();
