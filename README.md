# Weather Data Providers API

This repository is the API to retrieve information of different weather data providers using the database that was created in advance in https://github.com/albavilanova/weather-data-providers.

## Initialization

Create and run the Postgres container by using:

```
docker compose -f compose.yml up
```

Get the container ID (hash) of the running container by: 
``` 
docker ps -a
```

And proceed to inspect it to find the corresponding IP address:
```
docker inspect <hash>
```

Create an .env file containing:

```
DATABASE_URL="postgresql://postgres-user:postgres-password@<IP-address>:5432/postgres"
PORT="8080"
```

And start:
```
docker start <hash>
``` 

Install the dependencies, generate and push the schema and seed the database: 

```
bun install
bunx prisma generate
bunx prisma db push
bunx prisma db seed
```

This will create two data providers - one with one product and another one with two - two users and a review for one of the datasets.

You can now check its content with:

```
bunx prisma studio
```

Start listening in the server in port 8080:

```
bun run dev
```

You can test the API requests below by installing the extension Thunder Client in VS Code and importing the JSON file found in the folder `thunder-client`.

## API endpoints to test CRUD operations:

### 1. Create

**Create a new user**

Usage:

`POST` `/users`

Query parameters:

`firstName` (mandatory), `lastName` (mandatory), `organization` (mandatory),`position` (mandatory) and `email` (mandatory)

Example: 

```
http://localhost:8080/users?firstName=Miguel&lastName=Villarino&organization=Amrum&position=Senior researcher&email=miguel.villarino@amrum.com
```

**Create a new provider**

Usage:

`POST` `/providers`

Query parameters: 

`name` (mandatory), `headquarters` (mandatory) and `url` (mandatory)

Example: 

```
http://localhost:8080/providers?name=Meteomatics&headquarters=Switzerland&url=https://www.meteomatics.com/
```

**Create a new product**

Usage:

`POST` `/products`

Query parameters:

`name` (mandatory), `providerName` (mandatory), `variables` (mandatory), `startDate` (mandatory), `endDate` (mandatory) and `formats` (mandatory)

Examples: 

```
http://localhost:8080/products?providerName=CustomWeather&name=Wind atlas&variables=wind speed, wind direction&startDate=2019-01-01&endDate=2020-12-31&formats=csv
```

**Create a new review**

Usage:

`POST` `reviews`

Query parameters: 

`productName` (mandatory), `email` (mandatory), `title` (mandatory), `rating` (mandatory) and `message` (mandatory)

Example: 

```
http://localhost:8080/reviews?productName=U.S. Air Quality Forecasts&email=david.gomez@gmail.com&title=Excellent dataset&rating=8&message=Very useful, it would be better if more variables were included
```

### 2. Read

**Find users**

Usage:

`GET` `/users`

Query parameters: 

`firstName` (optional), `lastName` (optional), `email` (optional), `organization` (optional), `position` (optional), `startDate` (optional) and `endDate` (optional)

Examples:

```
http://localhost:8080/users
http://localhost:8080/users?email=david.gomez@gmail.com
http://localhost:8080/users?position=Research engineer
http://localhost:8080/users?firstName=Alba&lastName=Vilanova&organization=BSC
http://localhost:8080/users?startDate=2024-05-01&endDate=2024-12-31
```

**Find providers**

Usage:

`GET` `/providers`

Query parameters: 

`name` (optional) and `headquarters` (optional)

Examples:

```
http://localhost:8080/providers
http://localhost:8080/providers?name=CustomWeather
http://localhost:8080/providers?headquarters=Czech Republic
```

**Find products**

Usage:

`GET` `/products`

Query parameters:

`name` (optional), `providerName` (optional), `variables` (optional), `startDate` (optional), `endDate` (optional) and `formats` (optional)

Examples:

```
http://localhost:8080/products
http://localhost:8080/products?name=U.S. Air Quality Forecasts
http://localhost:8080/products?providerName=CustomWeather
http://localhost:8080/products?variables=wind speed, wind direction
http://localhost:8080/products?providerName=CustomWeather&variables=aqi
http://localhost:8080/products?startDate=2009-01-01&formats=csv
```

**Find reviews**

Usage:

`GET` `/reviews`

Query parameters: 

`productName` (optional), `email` (optional),  `title` (optional), `rating` (optional) and `message` (optional)

Examples:

```
http://localhost:8080/reviews
http://localhost:8080/reviews?rating=10
```

### 3. Update

**Update users**

Usage:

`PUT` `/users`

Query parameters:

`id` (mandatory), `firstName` (optional), `lastName` (optional), `email` (optional), `organization` (optional) and `position` (optional)

Examples: 

```
http://localhost:8080/users?id=clwwck7qc0001107lc8n38739&organization=Ayala&position=Senior web developer
```

**Update providers**

Usage:

`PUT` `/providers`

Query parameters: 

`id` (mandatory), `name` (optional), `headquarters` (optional) and `url` (optional)

Example: 

```
http://localhost:8080/providers?id=3&name=Meteomatics AG
```

**Update products**

Usage:

`PUT` `/products`

Query parameters:

`name` (optional), `providerName` (optional), `variables` (optional), `startDate` (optional), `endDate` (optional) and `formats` (optional)

Examples: 

```
http://localhost:8080/products?id=2&variables=nitrogen dioxide, methane&formats=grib, netcdf
```

**Update reviews**

Usage:

`PUT` `/reviews`

Query parameters: 

`id` (mandatory), `productName` (optional), `email` (optional),  `title` (optional), `rating` (optional) and `message` (optional)

Example: 

```
http://localhost:8080/reviews?id=1&rating=5&message=I have noticed that the data have wrong units&title=Wrong units
```

### 4. Delete

**Delete users**

Usage:

`DELETE` `/users`

Query parameters:

`firstName` (optional), `lastName` (optional), `email` (optional), `organization` (optional), `position` (optional), `startDate` (optional) and `endDate` (optional)

Examples: 

```
http://localhost:8080/users?email=david.gomez@gmail.com
http://localhost:8080/users?position=Research engineer
http://localhost:8080/users?firstName=Alba&lastName=Vilanova&organization=BSC
http://localhost:8080/users?startDate=2024-05-01&endDate=2024-05-31
```

**Delete providers**

Usage:

`DELETE` `/providers`

Query parameters: 

`name` (optional), `headquarters` (optional) and `url` (optional)

Example: 

```
http://localhost:8080/providers?headquarters=Czech Republic
```

**Delete products**

Usage:

`DELETE` `/products`

Query parameters:

`name` (optional), `providerName` (optional), `variables` (optional), `startDate` (optional), `endDate` (optional) and `formats` (optional)

Examples: 

```
http://localhost:8080/products?name=Historical Forecast Data
http://localhost:8080/products?providerName=CustomWeather
http://localhost:8080/products?variables=wind speed, wind direction
http://localhost:8080/products?providerName=CustomWeather&variables=aqi
```

**Delete reviews**

Usage:

`DELETE` `/reviews`

Query parameters: 

`rating` (optional)

Example: 

```
http://localhost:8080/reviews?rating=8
```