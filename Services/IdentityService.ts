import { LinkPrecedence, Prisma, contact } from "@prisma/client";
import { IRequestBody, IResponse } from "../Types/Types";
import prisma from "../prisma/Prisma";

/**
 * Business logic for [IdentityController](../Controllers/IdentityController.ts)
 * @param data
 * @returns
 */
export const getContact = async (data: IRequestBody) => {
  try {
    let contacts: contact[] = [];
    let response;
    const findContactsInDB = await findManyWithOr(data);

    // If one contact is found, create a new record if unique information is present
    // If multiple records found, update records if primary LinkPrecedence is present
    // else create a new primary contact

    if (!!findContactsInDB.length) {
      const contactsToBeSaved: any = [];
      const primary = findContactsInDB[0];

      if (findContactsInDB.length == 1) {
        const newContact = await checkIfUniqueAndCreate(primary, data);
        if (newContact) contacts.push(newContact);
      }

      findContactsInDB.forEach(async (contact: contact, index: number) => {
        if (index === 0) return;
        if (contact.linkPrecedence === LinkPrecedence.primary) {
          contact.linkPrecedence = LinkPrecedence.secondary;
          contact.linkedId = primary.id;
          contactsToBeSaved.push(prisma.contact.update({ where: { id: contact.id }, data: contact }));
          return;
        }
      });

      const updatedData = await updateOneOrMany(contactsToBeSaved);
      // return findContactsInDB;
    } else {
      const savedData = await save(data);
      contacts.push(savedData);
      // return savedData;
    }
    return contacts;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Find Contact List in Db with either phonenumber or email
const findManyWithOr = async (data: IRequestBody) => {
  return await prisma.contact.findMany({
    where: {
      OR: [{ phoneNumber: data.phoneNumber }, { email: data.email }],
    },
    orderBy: [{ createdAt: "asc" }],
  });
};

// Save Contact in Db
const save = async (body: any) => {
  return await prisma.contact.create({ data: body });
};

// Update one or more Contacts in Db
const updateOneOrMany = async (contacts: any) => {
  return await prisma.$transaction(contacts);
};

// Check if unique information is present, then create a new Contact in Db
const checkIfUniqueAndCreate = async (contact: contact, data: IRequestBody) => {
  if (contact.email !== data.email || contact.phoneNumber !== data.phoneNumber) {
    const linkedId = contact.linkPrecedence === LinkPrecedence.secondary ? contact.linkedId : contact.id;
    const newRecord = await save({
      email: data.email,
      phoneNumber: data.phoneNumber,
      linkPrecedence: LinkPrecedence.secondary,
      linkedId,
    });
    return newRecord;
  } else return null;
};

// Process the response in desired format
const processResponse = (contact: contact[]) => {};
