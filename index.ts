import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import routes from "./Routes/IndexRouter";
import prisma from "./prisma/Prisma";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.use("/", routes);

app.listen(port, () => {
  console.log(`⚡ Server is running at http://localhost:${port} ⚡`);
});

prisma.$connect().then(() => console.log("Database is connected"));
