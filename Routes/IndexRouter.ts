import { identityController } from "../Controllers/IdentityController";
import express, { Express } from "express";

const routes: Express = express();

routes.use("/identify", identityController);

export default routes;
