import db from "./db";

// Function to return conditions from args
export const checkArgs = function (query: any, args: string[]) {
  let conditions: { [key: string]: string } = {};
  for (var prop in query) {
    if (args.includes(prop)) {
      conditions[prop] = query[prop];
    }
  }
  return conditions;
};

// Function to get providers given certain conditions
export const getProvidersByArgs = async function (query: any) {
  let providers: any;

  // Check which conditions have been passed
  const conditions = checkArgs(query, ["name", "headquarters"]);
  if (conditions) {
    // Find providers
    providers = await db.provider.findMany({
      where: {
        name: conditions["name"],
        headquarters: conditions["headquarters"],
      },
    });
  } else {
    providers = [];
  }
  return providers;
};

// Function to get reviews given certain conditions
export const getReviewsByArgs = async function (query: any) {
  let reviews: any;

  // Check which conditions have been passed
  const conditions = checkArgs(query, ["rating"]);
  if (conditions) {
    // Get rating as int if it has been passed
    let rating;
    if (conditions.hasOwnProperty("rating")) {
      rating = parseInt(conditions["rating"]);
    }

    console.log(await db.review.findMany({}));
    // Find reviews
    reviews = await db.review.findMany({
      where: {
        rating: rating,
      },
    });
  } else {
    reviews = [];
  }
  return reviews;
};
