import { Router } from "express";
import { checkArgs, getProvidersByArgs } from "./main";
import db from "./db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const providers = await getProvidersByArgs(req.query);
    if (providers.length > 0) {
      res.status(200).json({ providers });
    } else {
      res.status(404).json({ message: "Not found." });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal error." });
  }
});

router.post("/", async (req, res) => {
  try {
    const name = req.query.name;
    const headquarters = req.query.headquarters;
    const url = req.query.url;

    const args = ["name", "headquarters", "url"];
    [name, headquarters, url].some(function (prop, index) {
      if (prop === undefined || typeof prop !== "string") {
        return res.status(400).json({ message: `Not found ${args[index]}` });
      }
    });

    const newProvider = await db.provider.create({
      data: {
        name,
        headquarters,
        url,
      },
    });
    res.status(200).json({ newProvider });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Couldn't create provider, try later." });
  }
});

router.delete("/", async (req, res) => {
  try {
    const providers = await getProvidersByArgs(req.query);
    if (providers.length > 0) {
      let names: string[] = [];
      for (const provider of providers) {
        await db.provider.delete({
          where: {
            providerId: provider.providerId,
          },
        });
        names.push(provider.name);
      }
      res.status(200).json({
        message:
          names.length === 1
            ? `Provider ${names} was successfully deleted`
            : `Providers ${names} were successfully deleted`,
      });
    } else {
      res.status(404).json({ message: "Not found." });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal error." });
  }
});

router.put("/", async (req, res) => {
  try {
    const args = ["id", "name", "headquarters", "url"];
    const conditions = checkArgs(req.query, args);

    if (!conditions.hasOwnProperty("id")) {
      res.status(400).json({ error: "Provider id must be passed." });
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
      res.status(200).json({ updatedProvider });
    } else {
      res.status(400).json({
        error: `Provider with id ${conditions["id"]} does not exist in database`,
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal error." });
  }
});

export default router;
