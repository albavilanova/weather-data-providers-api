import type { RequestHandler } from "express";

export const catchErrors =
  (myHandler: RequestHandler): RequestHandler =>
  async (req, res, next) => {
    try {
      await myHandler(req, res, next);
    } catch (e: any) {
      next(e);
    }
  };
