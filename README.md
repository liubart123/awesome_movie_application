# Awesome movie application
It is simple Node.js applicaion, and was made for recruitment task. 

Contains 3 endpoints to create movie, get movie by ID and get all movies of user.

User has role, which determines the count of movies that can be added per month by this user.

For creating movie application gets title from request body and search movie with this title on http://www.omdbapi.com, after that founded movie is inserted in database.

## Used technologies and libraries:
- Express
- Typescript
- JWT
- Docker-compose. Application consists of 3 docker containers:
  - Postgres database
  - Authentication server (with hardcoded database of users)
  - Main express applicaion
- Github actions (for testing application after PRs)
- Jest (I've wrote only simple integraion tests with mocks for external source, auth server and Date)
- TypeORM 
- Swagger
- Winston for logging
- Axios for requesting external source
- Eslint and Prettier

## Running project
Project can be started with docker compose, than all containers will mount and everythin should work fine, because I left .env file in it repository and express application has default value for env variables.

To run application on host machine you need to run postgres and auth containers, build project and then start it:
```
docker-compose up db
docker-compose up authentication
cd MoviesService
npm run build
npm run start
```
To run test: `npm run test`
To execute typeORM command you should start them with `npm run typerm`
For example command for migration looks like: `npm run typeorm migration:generate -- -n <name>`
