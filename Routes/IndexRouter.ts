import {
  identityController,
  indexController,
} from "Controllers/IdentityController";
import express, { Express } from "express";

const routes: Express = express();

routes.use("/", indexController);
routes.use("/identity", identityController);

export default routes;
