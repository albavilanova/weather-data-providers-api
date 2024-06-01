import { Router } from "express";
import { checkArgs, getReviewsByArgs } from "../main";
import db from "../db";
import { catchErrors } from "../errors";
import { send } from "../response";

const router = Router();

router.get(
  "/",
  catchErrors(async (req, res) => {
    const reviews = await getReviewsByArgs(req.query);
    if (reviews.length > 0) {
      send(res).ok(reviews);
    } else {
      send(res).notFound();
    }
  })
);

router.post(
  "/",
  catchErrors(async (req, res) => {
    const productName = req.query.productName;
    const email = req.query.email;
    const title = req.query.title;
    const rating = req.query.rating;
    const message = req.query.message;

    const args = ["productName", "email", "title", "rating", "message"];
    [productName, email, title, rating, message].some(function (prop, index) {
      if (prop === undefined || typeof prop !== "string") {
        return send(res).badRequest(`Argument ${args[index]} should be passed`);
      }
    });

    // Convert rating to int
    const ratingNumber = parseInt(rating);

    // Get user and product
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    const product = await db.product.findUnique({
      where: {
        name: productName,
      },
    });
    // Create new review
    if (user !== null && product !== null) {
      const newReview = await db.review.create({
        data: {
          title,
          message,
          rating: ratingNumber,
          userId: user.userId,
          productId: product.productId,
        },
      });
      send(res).createOk(newReview);
    } else {
      return send(res).badRequest("User or product does not exist");
    }
  })
);

router.delete(
  "/",
  catchErrors(async (req, res) => {
    const reviews = await getReviewsByArgs(req.query);
    if (reviews.length > 0) {
      let ids: string[] = [];
      for (const review of reviews) {
        await db.review.delete({
          where: {
            reviewId: review.reviewId,
          },
        });
        ids.push(review.reviewId);
      }
      send(res).messageOk(
        ids.length === 1
          ? `Review with ID ${ids} was successfully deleted`
          : `Reviews with IDs ${ids} were successfully deleted`
      );
    } else {
      send(res).notFound();
    }
  })
);

router.put(
  "/",
  catchErrors(async (req, res) => {
    const args = ["id", "productName", "email", "title", "rating", "message"];
    const conditions = checkArgs(req.query, args);

    if (!conditions.hasOwnProperty("id")) {
      send(res).badRequest("Review ID must be passed.");
    }

    // Check if review exists
    const id = parseInt(conditions["id"]);
    const review = await db.review.findUnique({
      where: {
        reviewId: id,
      },
    });

    // Convert rating to int
    let ratingNumber;
    if (conditions.hasOwnProperty("rating")) {
      ratingNumber = parseInt(conditions["rating"]);
    }

    if (review !== null) {
      const updatedReview = await db.review.update({
        where: {
          reviewId: id,
        },
        data: {
          productName: conditions["productName"],
          email: conditions["email"],
          title: conditions["title"],
          rating: ratingNumber,
          message: conditions["message"],
        },
      });
      send(res).ok(updatedReview);
    } else {
      send(res).notFound();
    }
  })
);

export default router;
