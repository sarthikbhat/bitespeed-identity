"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const IdentityController_1 = require("../Controllers/IdentityController");
const routes = (0, express_1.default)();
routes.use("/", IdentityController_1.indexController);
routes.use("/identity", (res, req) => { });
exports.default = routes;
