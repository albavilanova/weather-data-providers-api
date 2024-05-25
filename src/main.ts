import db from "./db";

// Function to return conditions from args
export const checkArgs = function (args: string[]) {
  let conditions: { [key: string]: string } = {};
  args.map((arg) => {
    process.argv.map((inputArg) => {
      if (inputArg.includes("=")) {
        if (inputArg.split("=")[0].includes(`--${arg}`)) {
          conditions[arg] = inputArg.split("=")[1];
        }
      }
    });
  });
  return conditions;
};

// Function to get providers given certain conditions
export const getProvidersByArgs = async function () {
    let providers: any;
  
    // Check which conditions have been passed through command line
    const conditions = checkArgs(["name", "headquarters"]);
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