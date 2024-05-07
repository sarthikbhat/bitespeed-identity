import { Request, Response } from "express";

export const indexController = async (req: Request, res: Response) => {
  res.send("Server is Up");
};

export const identityController = async (req: Request, res: Response) => {};
