import { Router } from "express";
import { checkArgs, getProductsByArgs } from "../main";
import db from "../db";
import { catchErrors } from "../errors";
import { send } from "../response";

const router = Router();

router.get(
  "/",
  catchErrors(async (req, res) => {
    const products = await getProductsByArgs(req.query);
    if (products.length > 0) {
      send(res).ok(products);
    } else {
      send(res).notFound();
    }
  })
);

export default router;
