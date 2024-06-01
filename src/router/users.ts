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

router.delete(
  "/",
  catchErrors(async (req, res) => {
    const users = await getUsersByArgs(req.query);
    if (users.length > 0) {
      let ids: string[] = [];
      for (const user of users) {
        await db.user.delete({
          where: {
            userId: user.userId,
          },
        });
        ids.push(user.userId);
      }
      send(res).messageOk(
        ids.length === 1
          ? `User with ID ${ids} was successfully deleted`
          : `Users with IDs ${ids} were successfully deleted`
      );
    } else {
      send(res).notFound();
    }
  })
);

router.put(
  "/",
  catchErrors(async (req, res) => {
    const args = [
      "id",
      "firstName",
      "lastName",
      "organization",
      "position",
      "email",
    ];
    const conditions = checkArgs(req.query, args);

    if (!conditions.hasOwnProperty("id")) {
      send(res).badRequest("User ID must be passed.");
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: {
        userId: conditions["id"],
      },
    });

    if (user !== null) {
      const updatedUser = await db.user.update({
        where: {
          userId: conditions["id"],
        },
        data: {
          firstName: conditions["firstName"],
          lastName: conditions["lastName"],
          email: conditions["email"],
          organization: conditions["organization"],
          position: conditions["position"],
        },
      });
      send(res).ok(updatedUser);
    } else {
      send(res).notFound();
    }
  })
);

export default router;
