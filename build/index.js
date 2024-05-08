"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const IndexRouter_1 = __importDefault(require("./Routes/IndexRouter"));
const Prisma_1 = __importDefault(require("./prisma/Prisma"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
app.use(body_parser_1.default.json({ limit: "10mb" }));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use("/", IndexRouter_1.default);
app.listen(port, () => {
    console.log(`⚡ Server is running at http://localhost:${port} ⚡`);
});
Prisma_1.default.$connect().then(() => console.log("Database is connected"));
