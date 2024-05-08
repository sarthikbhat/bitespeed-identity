"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContact = void 0;
const client_1 = require("@prisma/client");
const Prisma_1 = __importDefault(require("../prisma/Prisma"));
const getContact = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let contacts = [];
        let response;
        const findContactsInDB = yield findManyWithOr(data);
        // If one or more contacts is found
        // else create a new primary contact
        if (!!findContactsInDB.length) {
            console.log(findContactsInDB);
            const contactsToBeSaved = [];
            const primary = findContactsInDB[0];
            findContactsInDB.forEach((contact, index) => {
                if (index === 0)
                    return;
                if (contact.linkPrecedence === client_1.LinkPrecedence.primary) {
                    contact.linkPrecedence = client_1.LinkPrecedence.secondary;
                    contactsToBeSaved.push(Prisma_1.default.contact.update({ where: { id: contact.id }, data: contact }));
                    return;
                }
            });
            const updatedData = yield updateOneOrMany(contactsToBeSaved);
            return findContactsInDB;
        }
        else {
            const savedData = yield save(data);
            contacts.push(savedData);
            return savedData;
        }
        return response;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.getContact = getContact;
const findManyWithOr = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Prisma_1.default.contact.findMany({
        where: {
            OR: [{ phoneNumber: data.phoneNumber }, { email: data.email }],
        },
        orderBy: [{ createdAt: "asc" }],
    });
});
const save = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        email: body.email,
        phoneNumber: body.phoneNumber,
        linkPrecedence: client_1.LinkPrecedence.primary,
    };
    return yield Prisma_1.default.contact.create({ data });
});
const updateOneOrMany = (contacts) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Prisma_1.default.$transaction(contacts);
});
