import { LinkPrecedence, Prisma, contact } from "@prisma/client";
import { IRequestBody, IResponse } from "../Types/Types";
import prisma from "../prisma/Prisma";
import { DefaultArgs } from "@prisma/client/runtime/library";

export const getContact = async (data: IRequestBody) => {
  try {
    let contacts: contact[] = [];
    let response;
    const findContactsInDB = await findManyWithOr(data);

    // If one or more contacts is found
    // else create a new primary contact
    if (!!findContactsInDB.length) {
      console.log(findContactsInDB);

      const contactsToBeSaved: any = [];
      const primary = findContactsInDB[0];
      findContactsInDB.forEach((contact: contact, index: number) => {
        if (index === 0) return;
        if (contact.linkPrecedence === LinkPrecedence.primary) {
          contact.linkPrecedence = LinkPrecedence.secondary;
          contactsToBeSaved.push(prisma.contact.update({ where: { id: contact.id }, data: contact }));
          return;
        }
      });
      const updatedData = await updateOneOrMany(contactsToBeSaved);
      return findContactsInDB;
    } else {
      const savedData = await save(data);
      contacts.push(savedData);
      return savedData;
    }
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findManyWithOr = async (data: IRequestBody) => {
  return await prisma.contact.findMany({
    where: {
      OR: [{ phoneNumber: data.phoneNumber }, { email: data.email }],
    },
    orderBy: [{ createdAt: "asc" }],
  });
};

const save = async (body: IRequestBody) => {
  const data = {
    email: body.email,
    phoneNumber: body.phoneNumber,
    linkPrecedence: LinkPrecedence.primary,
  };
  return await prisma.contact.create({ data });
};

const updateOneOrMany = async (contacts: any) => {
  return await prisma.$transaction(contacts);
};
