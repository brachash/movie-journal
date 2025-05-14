import { Response } from "express";

export const sendError = (res: Response, code: number, message: string) =>
  res.status(code).json({ message });
