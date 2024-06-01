import { Router } from "express";
import { checkArgs, getUsersByArgs } from "../main";
import db from "../db";
import { catchErrors } from "../errors";
import { send } from "../response";

const router = Router();

router.get(
  "/",
  catchErrors(async (req, res) => {
    const users = await getUsersByArgs(req.query);
    if (users.length > 0) {
      send(res).ok(users);
    } else {
      send(res).notFound();
    }
  })
);

export default router;
