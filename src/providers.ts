import { Router } from "express";
import { getProvidersByArgs } from "./main";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const providers = await getProvidersByArgs(req.query);
    res.status(200).json({ providers });
  } catch (e) {
    res.status(500).json({ error: "Internal Error" });
  }
});

export default router;
