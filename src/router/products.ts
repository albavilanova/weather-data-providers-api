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

router.put(
  "/",
  catchErrors(async (req, res) => {
    const args = [
      "id",
      "name",
      "providerName",
      "variables",
      "startDate",
      "endDate",
      "formats",
    ];
    const conditions = checkArgs(req.query, args);

    if (!conditions.hasOwnProperty("id")) {
      send(res).badRequest("Product ID must be passed.");
    }

    // Check if product exists
    const id = parseInt(conditions["id"]);
    const product = await db.product.findUnique({
      where: {
        productId: id,
      },
    });

    if (product !== null) {
      let provider;
      if (conditions.hasOwnProperty("providerName")) {
        // Get provider
        provider = await db.provider.findUnique({
          where: {
            name: conditions["providerName"],
          },
        });
      }

      // Get variables as string array if they have been passed
      let variablesArray: string[] = [];
      if (conditions.hasOwnProperty("variables")) {
        variablesArray = conditions["variables"]
          .split(",")
          .map((str) => str.trim());
      }
      let formatsArray: string[] = [];
      if (conditions.hasOwnProperty("formats")) {
        formatsArray = conditions["formats"]
          .split(",")
          .map((str) => str.trim());
      }

      // Create dates
      let startDateJS;
      let endDateJS;
      if (conditions.hasOwnProperty("startDate")) {
        startDateJS = new Date(conditions["startDate"]);
        console.log(`Start date converted to ${startDateJS}`);
      }
      if (conditions.hasOwnProperty("endDate")) {
        endDateJS = new Date(conditions["endDate"]);
        console.log(`End date converted to ${endDateJS}`);
      }

      const updatedProduct = await db.product.update({
        where: {
          productId: id,
        },
        data: {
          name: conditions["name"],
          providerId:
            provider !== null && provider !== undefined
              ? provider.providerId
              : undefined,
          variables: variablesArray.length > 0 ? variablesArray : undefined,
          startDate: startDateJS,
          endDate: endDateJS,
          formats: formatsArray.length > 0 ? formatsArray : undefined,
        },
      });

      send(res).ok(updatedProduct);
    } else {
      send(res).notFound();
    }
  })
);

export default router;
