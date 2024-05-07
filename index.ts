import express, { Express } from "express";
import dotenv from "dotenv";
import routes from "./Routes/IndexRouter";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use("/", routes);

app.listen(port, () => {
  console.log(`⚡ Server is running at http://localhost:${port} ⚡`);
});
