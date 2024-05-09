import { identityController } from "../Controllers/IdentityController";
import express, { Express } from "express";

const routes: Express = express();

routes.post("/identify", identityController);

export default routes;
