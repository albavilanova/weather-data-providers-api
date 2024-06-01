import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// Add CustomWeather provider
const CustomWeather = await db.provider.create({
  data: {
    name: "CustomWeather",
    headquarters: "United States",
    url: "https://customweather.com/",
    products: {
      createMany: {
        data: [
          {
            name: "Historical Forecast Data",
            variables: [
              "temperature",
              "wind speed",
              "wind direction",
              "humidity",
              "comfort level",
              "UV index",
              "probability of precipitation",
              "visibility",
            ],
            startDate: new Date("2009-08-02"),
            formats: ["json", "xml", "csv"],
          },
          {
            name: "U.S. Air Quality Forecasts",
            variables: ["primary air pollutant", "ozone", "aqi"],
            formats: ["json", "xml", "csv"],
          },
        ],
      },
    },
  },
});
console.log("Data from CustomWeather was added");

// Add Meteosource Weather provider
const MeteosourceWeather = await db.provider.create({
  data: {
    name: "Meteosource Weather",
    headquarters: "Czech Republic",
    url: "https://www.meteosource.com/",
    products: {
      createMany: {
        data: [
          {
            name: "Air quality forecasts",
            variables: [
              "aerosol_550",
              "air_quality",
              "co_surface",
              "dust_550nm",
              "dust_mixing_ratio_05",
              "no2_surface",
              "no_surface",
              "ozone_surface",
              "ozone_total",
              "pm10",
              "pm25",
              "so2_surface",
            ],
            formats: ["json"],
          },
        ],
      },
    },
  },
});
console.log("Data from Meteosource Weather was added");

// Create users
const users = await db.user.createMany({
  data: [
    {
      firstName: "Alba",
      lastName: "Vilanova",
      organization: "BSC",
      position: "Research engineer",
      email: "alba.vilanova@gmail.com",
    },
    {
      firstName: "David",
      lastName: "Gómez",
      organization: "Kaya",
      position: "Web developer",
      email: "david.gomez@gmail.com",
    },
  ],
});
console.log("Users were added");

// Add reviews
const user = await db.user.findUnique({
  where: {
    email: "alba.vilanova@gmail.com",
  },
});
if (user !== null) {
  const firstProduct = await db.product.findUnique({
    where: {
      name: "Historical Forecast Data",
    },
  });
  if (firstProduct !== null) {
    await db.review.create({
      data: {
        title: "Very accurate",
        rating: 10,
        userId: user.userId,
        productId: firstProduct.productId,
      },
    });
  }

  const secondProduct = await db.product.findUnique({
    where: {
      name: "U.S. Air Quality Forecasts",
    },
  });
  if (secondProduct !== null) {
    await db.review.create({
      data: {
        title: "Useful",
        rating: 7,
        userId: user.userId,
        productId: secondProduct.productId,
      },
    });
  }
  console.log("Two reviews were added");
}
