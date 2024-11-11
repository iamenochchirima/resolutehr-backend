import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import "dotenv/config";
import router from "./router";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/error";

const app = express();
app.use(
  cors({
    origin: [
      "https://55e7x-xyaaa-aaaal-qmzsq-cai.icp0.io",
      "http://localhost:3000", 
      `http://bw4dl-smaaa-aaaaa-qaacq-cai.localhost:4943`
    ],
    methods: ['GET', 'POST'],
    credentials: true, 
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

const server = http.createServer(app);

export const prismaClient  = new PrismaClient({
  log: ["query"],
});

server.listen({ port: PORT, host: HOST }, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.use("/api", router());

app.use(errorMiddleware);
