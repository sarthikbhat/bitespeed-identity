import { Request, Response } from "express";
import prisma from "../prisma/Prisma";
import { IRequestBody, IResponse } from "../Types/Types";
import { getContact } from "../Services/IdentityService";

export const identityController = async (req: Request, res: Response) => {
  try {
    let response: IResponse;
    const body: IRequestBody = req.body;
    const resp = await getContact(body);
    res.json(resp);
  } catch (error) {
    console.log(error);
  }
};
