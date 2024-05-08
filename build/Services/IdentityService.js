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
/**
 * Business logic for [IdentityController](../Controllers/IdentityController.ts)
 * @param data
 * @returns
 */
const getContact = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let contacts = [];
        let response;
        const findContactsInDB = yield findManyWithOr(data);
        // If one contact is found, create a new record if unique information is present
        // If multiple records found, update records if primary LinkPrecedence is present
        // else create a new primary contact
        if (!!findContactsInDB.length) {
            const contactsToBeSaved = [];
            const primary = findContactsInDB[0];
            if (findContactsInDB.length == 1) {
                const newContact = yield checkIfUniqueAndCreate(primary, data);
                if (newContact)
                    contacts.push(newContact);
            }
            findContactsInDB.forEach((contact, index) => __awaiter(void 0, void 0, void 0, function* () {
                if (index === 0)
                    return;
                if (contact.linkPrecedence === client_1.LinkPrecedence.primary) {
                    contact.linkPrecedence = client_1.LinkPrecedence.secondary;
                    contact.linkedId = primary.id;
                    contactsToBeSaved.push(Prisma_1.default.contact.update({ where: { id: contact.id }, data: contact }));
                    return;
                }
            }));
            const updatedData = yield updateOneOrMany(contactsToBeSaved);
            // return findContactsInDB;
        }
        else {
            const savedData = yield save(data);
            contacts.push(savedData);
            // return savedData;
        }
        return contacts;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.getContact = getContact;
// Find Contact List in Db with either phonenumber or email
const findManyWithOr = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Prisma_1.default.contact.findMany({
        where: {
            OR: [{ phoneNumber: data.phoneNumber }, { email: data.email }],
        },
        orderBy: [{ createdAt: "asc" }],
    });
});
// Save Contact in Db
const save = (body) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Prisma_1.default.contact.create({ data: body });
});
// Update one or more Contacts in Db
const updateOneOrMany = (contacts) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Prisma_1.default.$transaction(contacts);
});
// Check if unique information is present, then create a new Contact in Db
const checkIfUniqueAndCreate = (contact, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (contact.email !== data.email || contact.phoneNumber !== data.phoneNumber) {
        const linkedId = contact.linkPrecedence === client_1.LinkPrecedence.secondary ? contact.linkedId : contact.id;
        const newRecord = yield save({
            email: data.email,
            phoneNumber: data.phoneNumber,
            linkPrecedence: client_1.LinkPrecedence.secondary,
            linkedId,
        });
        return newRecord;
    }
    else
        return null;
});
// Process the response in desired format
const processResponse = (contact) => { };
