import { LinkPrecedence, Prisma, contact } from "@prisma/client";
import { ConsolidatedContact, IRequestBody, IResponse } from "../Types/Types";
import prisma from "../prisma/Prisma";

/**
 * Business logic for [IdentityController](../Controllers/IdentityController.ts)
 * @param data
 */
export const getContact = async (data: IRequestBody): Promise<ConsolidatedContact> => {
  try {
    let contacts: contact[] = [];
    const findContactsInDB = await findManyWithOr(data);

    /**
     * If one contact is found, create a new record if unique information is present
     * If multiple records found, update records if primary LinkPrecedence is present
     * else create a new primary contact
     */
    if (!!findContactsInDB.length) {
      const contactsToBeSaved: any = [];
      const primary = findContactsInDB[0];

      // if (findContactsInDB.length == 1) {
      //   const newContact = await checkIfUniqueAndCreate([primary], data);
      //   if (newContact) contacts.push(newContact);
      // }

      findContactsInDB.forEach(async (contact: contact, index: number) => {
        if (index === 0) {
          if (contact.linkPrecedence === LinkPrecedence.secondary) {
            contact.linkPrecedence = LinkPrecedence.primary;
            contact.linkedId = null;
            contactsToBeSaved.push(prisma.contact.update({ where: { id: contact.id }, data: contact }));
            return;
          } else return;
        }
        if (contact.linkPrecedence === LinkPrecedence.primary) {
          contact.linkPrecedence = LinkPrecedence.secondary;
          contact.linkedId = primary.id;
          contactsToBeSaved.push(prisma.contact.update({ where: { id: contact.id }, data: contact }));
          return;
        }
      });

      await updateOneOrMany(contactsToBeSaved);
      contacts.push(...findContactsInDB);
      const newContact = await checkIfUniqueAndCreate([...findContactsInDB], data);
      if (newContact) contacts.push(newContact);
    } else {
      const savedData = await save(data);
      contacts.push(savedData);
    }

    return processResponse(contacts);
  } catch (error) {
    throw error;
  }
};

/**
 * Find Contact List in DB with either phonenumber or email
 * @param data
 */
const findManyWithOr = async (data: IRequestBody): Promise<contact[]> => {
  return await prisma.contact.findMany({
    where: {
      OR: [{ phoneNumber: data.phoneNumber }, { email: data.email }],
    },
    orderBy: [{ createdAt: "asc" }],
  });
};

/**
 * Save Contact in DB
 * @param body
 */
const save = async (body: any): Promise<contact> => {
  return await prisma.contact.create({ data: body });
};

/**
 * Update one or more Contacts in Db
 * @param contacts
 */
const updateOneOrMany = async (contacts: any): Promise<any[]> => {
  return await prisma.$transaction(contacts);
};

/**
 * Check if unique information is present, then create a new Contact in Db
 * @param contact
 * @param data
 */
const checkIfUniqueAndCreate = async (contact: contact[], data: IRequestBody): Promise<contact | null> => {
  if (!existsInformation(contact, data)) {
    const linkedId = contact[0].linkPrecedence === LinkPrecedence.secondary ? contact[0].linkedId : contact[0].id;
    const newRecord = await save({
      email: data.email,
      phoneNumber: data.phoneNumber,
      linkPrecedence: LinkPrecedence.secondary,
      linkedId,
    });
    return newRecord;
  } else return null;
};

/**
 * Check if information is present, then return true / false
 * @param contact
 * @param data
 */
const existsInformation = (contacts: contact[], data: IRequestBody): boolean => {
  const phone = contacts.findIndex((elm: contact) => elm.phoneNumber === data.phoneNumber);
  if (phone === -1) return false;
  const email = contacts.findIndex((elm: contact) => elm.email === data.email);
  if (email === -1) return false;
  return true;
};

/**
 * Process the response in desired format
 * @param contacts
 */
const processResponse = (contacts: contact[]): ConsolidatedContact => {
  const initAccData = new ConsolidatedContact();
  return contacts.reduce((acc: ConsolidatedContact, item: contact) => {
    if (item.linkPrecedence === "primary") {
      acc.primaryContatctId = item.id;
    } else {
      acc.secondaryContactIds = [...new Set([...acc.secondaryContactIds, item.id])];
    }
    if (item.email) acc.emails = [...new Set([...acc.emails, item.email])];
    if (item.phoneNumber) acc.phoneNumbers = [...new Set([...acc.phoneNumbers, item.phoneNumber])];
    return acc;
  }, initAccData);
};
