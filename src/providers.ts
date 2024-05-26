import { Router } from "express";
import { getProvidersByArgs } from "./main";
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
      console.log(prop, prop === undefined);
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

export default router;
