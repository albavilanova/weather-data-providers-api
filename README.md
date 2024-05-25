# Weather Data Providers API

This repository will be the API to retrieve information of different weather data providers using the database that was created in advance in https://github.com/albavilanova/weather-data-providers.

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
