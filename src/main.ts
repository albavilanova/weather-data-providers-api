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

// Function to get users given certain conditions
export const getUsersByArgs = async function (query: any) {
  let users: any;

  // Check which conditions have been passed through command line
  const conditions = checkArgs(query, [
    "firstName",
    "lastName",
    "email",
    "organization",
    "position",
    "startDate",
    "endDate",
  ]);
  if (conditions) {
    // Create dates
    let startDate;
    let endDate;
    if (conditions.hasOwnProperty("startDate")) {
      startDate = new Date(conditions["startDate"]);
      console.log(`Start date converted to ${startDate}`);
    }
    if (conditions.hasOwnProperty("endDate")) {
      endDate = new Date(conditions["endDate"]);
      console.log(`End date converted to ${endDate}`);
    }

    // Find users
    users = await db.user.findMany({
      where: {
        firstName: conditions["firstName"],
        lastName: conditions["lastName"],
        email: conditions["email"],
        organization: conditions["organization"],
        position: conditions["position"],
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  } else {
    users = [];
  }

  return users;
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

// Function to get products given certain conditions
export const getProductsByArgs = async function (query: any) {
  let products: any;

  // Check which conditions have been passed through command line
  const conditions = checkArgs(query, [
    "name",
    "providerName",
    "variables",
    "startDate",
    "endDate",
    "formats"
  ]);
  if (conditions) {
    // Get provider if it has been passed
    let provider;
    if (conditions.hasOwnProperty("providerName")) {
      provider = await db.provider.findUnique({
        where: {
          name: conditions["providerName"],
        },
      });
      if (provider === null) {
        console.error(`Provider does not exist in database`);
        process.exit(1);
      }
    }

    // Get variables as string array if they have been passed
    let variablesArray: string[] = [];
    if (conditions.hasOwnProperty("variables")) {
      variablesArray = conditions["variables"]
        .split(",")
        .map((str) => str.trim());
    }

    // Get formats as string array if they have been passed
    let formatsArray: string[] = [];
    if (conditions.hasOwnProperty("formats")) {
      formatsArray = conditions["formats"].split(",").map((str) => str.trim());
    }

    // Create dates
    let startDate;
    let endDate;
    if (conditions.hasOwnProperty("startDate")) {
      startDate = new Date(conditions["startDate"]);
      console.log(`Start date converted to ${startDate}`);
    }
    if (conditions.hasOwnProperty("endDate")) {
      endDate = new Date(conditions["endDate"]);
      console.log(`End date converted to ${endDate}`);
    }
    // Find products
    products = await db.product.findMany({
      where: {
        name: conditions["name"],
        provider: provider,
        variables:
          variablesArray.length > 0 ? { hasEvery: variablesArray } : undefined,
        startDate: {
          gte: startDate,
        },
        endDate: {
          lte: endDate,
        },
        formats: formatsArray.length > 0 ? { hasSome: formatsArray } : undefined,
      },
    });
  } else {
    products = [];
  }

  return products;
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
