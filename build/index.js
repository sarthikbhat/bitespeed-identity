"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const IndexRouter_1 = __importDefault(require("Routes/IndexRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use("/", IndexRouter_1.default);
app.listen(port, () => {
    console.log(`⚡ Server is running at http://localhost:${port} ⚡`);
});
