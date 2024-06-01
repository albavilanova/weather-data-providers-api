import { Router } from "express";
import { checkArgs, getProvidersByArgs } from "../main";
import db from "../db";
import { catchErrors } from "../errors";
import { send } from "../response";

const router = Router();

router.get(
  "/",
  catchErrors(async (req, res) => {
    const providers = await getProvidersByArgs(req.query);
    if (providers.length > 0) {
      send(res).ok(providers);
    } else {
      send(res).notFound();
    }
  })
);

router.post(
  "/",
  catchErrors(async (req, res) => {
    const name = req.query.name;
    const headquarters = req.query.headquarters;
    const url = req.query.url;

    const args = ["name", "headquarters", "url"];
    [name, headquarters, url].some(function (prop, index) {
      if (prop === undefined || typeof prop !== "string") {
        return send(res).badRequest(`Argument ${args[index]} should be passed`);
      }
    });

    const newProvider = await db.provider.create({
      data: {
        name,
        headquarters,
        url,
      },
    });
    send(res).createOk(newProvider);
  })
);

router.delete(
  "/",
  catchErrors(async (req, res) => {
    const providers = await getProvidersByArgs(req.query);
    if (providers.length > 0) {
      let ids: string[] = [];
      for (const provider of providers) {
        await db.provider.delete({
          where: {
            providerId: provider.providerId,
          },
        });
        ids.push(provider.providerId);
      }
      send(res).messageOk(
        ids.length === 1
          ? `Provider with ID ${ids} was successfully deleted`
          : `Providers with IDs ${ids} were successfully deleted`
      );
    } else {
      send(res).notFound();
    }
  })
);

router.put(
  "/",
  catchErrors(async (req, res) => {
    const args = ["id", "name", "headquarters", "url"];
    const conditions = checkArgs(req.query, args);

    if (!conditions.hasOwnProperty("id")) {
      send(res).badRequest("Provider ID must be passed.");
    }

    // Check if provider exists
    const id = parseInt(conditions["id"]);
    const provider = await db.provider.findUnique({
      where: {
        providerId: id,
      },
    });

    if (provider !== null) {
      const updatedProvider = await db.provider.update({
        where: {
          providerId: id,
        },
        data: {
          name: conditions["name"],
          headquarters: conditions["headquarters"],
        },
      });
      send(res).ok(updatedProvider);
    } else {
      send(res).notFound();
    }
  })
);

export default router;
