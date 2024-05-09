import { Request, Response } from "express";
import { getContact } from "../Services/IdentityService";
import { IRequestBody, IResponse } from "Types/Types";

/**
 * Controller Function to identify the contacts and send response
 * @param req
 * @param res
 */
export const identityController = async (req: Request, res: Response): Promise<void> => {
  try {
    const body: IRequestBody = req.body;
    const consolidatedContact = await getContact(body);
    const response: IResponse = {
      contact: consolidatedContact,
    };
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};
