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

router.post(
  "/",
  catchErrors(async (req, res) => {
    const firstName = req.query.firstName;
    const lastName = req.query.lastName;
    const organization = req.query.organization;
    const position = req.query.position;
    const email = req.query.email;

    const args = ["firstName", "lastName", "organization", "position", "email"];
    [firstName, lastName, organization].some(function (prop, index) {
      if (prop === undefined || typeof prop !== "string") {
        return send(res).badRequest(`Argument ${args[index]} should be passed`);
      }
    });

    // Create new user
    const newUser = await db.user.create({
      data: {
        firstName,
        lastName,
        position,
        organization,
        email,
      },
    });
    send(res).createOk(newUser);
  })
);

export default router;
