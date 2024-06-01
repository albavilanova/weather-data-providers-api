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

router.post(
  "/",
  catchErrors(async (req, res) => {
    const name = req.query.name;
    const providerName = req.query.providerName;
    const variables = req.query.variables;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const formats = req.query.formats;

    const args = [
      "name",
      "providerName",
      "variables",
      "startDate",
      "endDate",
      "formats",
    ];
    [name, providerName, variables, startDate, endDate, formats].some(function (
      prop,
      index
    ) {
      if (prop === undefined || typeof prop !== "string") {
        return send(res).badRequest(`Argument ${args[index]} should be passed`);
      }
    });

    // Get provider
    const provider = await db.provider.findUnique({
      where: {
        name: providerName,
      },
    });

    if (provider !== null) {
      // Convert strings to string arrays
      const variablesArray = variables.split(",").map((str) => str.trim());
      const formatsArray = formats.split(",").map((str) => str.trim());

      // Create dates
      const startDateJS = new Date(startDate);
      console.log(`Start date converted to ${startDateJS}`);
      const endDateJS = new Date(endDate);
      console.log(`End date converted to ${endDateJS}`);

      // Create new product
      const newProduct = await db.product.create({
        data: {
          name: name,
          variables: variablesArray,
          startDate: startDateJS,
          endDate: endDateJS,
          formats: formatsArray,
          providerId: provider.providerId,
        },
      });
      send(res).createOk(newProduct);
    } else {
      send(res).badRequest("Provider does not exist");
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
