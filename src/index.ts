import dotenv from "dotenv";
dotenv.config();

import config from "./config";
config.config([
    "DB_USERNAME",
    "DB_PASSWORD",
    "DB_NAME",
    "DB_PORT",
    "DB_HOST",
    "JWT_SECRET",
]);

import "./strategies/jwt";

import { Server } from "./Server";

const server = new Server();

server.start();
