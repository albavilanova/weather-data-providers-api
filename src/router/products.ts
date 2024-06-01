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

router.delete(
  "/",
  catchErrors(async (req, res) => {
    const products = await getProductsByArgs(req.query);
    if (products.length > 0) {
      let ids: string[] = [];
      for (const product of products) {
        await db.product.delete({
          where: {
            productId: product.productId,
          },
        });
        ids.push(product.productId);
      }
      send(res).messageOk(
        ids.length === 1
          ? `Product with ID ${ids} was successfully deleted`
          : `Products with IDs ${ids} were successfully deleted`
      );
    } else {
      send(res).notFound();
    }
  })
);

export default router;
