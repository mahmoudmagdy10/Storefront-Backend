# Udacity: Build A Storefront Backend

This is a backend API build in Nodejs for an online store. It exposes a RESTful API that will be used by the frontend developer on the frontend. 

The database schema and and API route information can be found in the [REQUIREMENT.md](REQUIREMENTS.md) 

## Installation Instructions
This section contains all the packages used in this project and how to install them. 
`yarn` or `npm install`

### Packages

#### express
`npm i -S express`
`npm i -D @types/express`

#### typescript
`npm i -D typescript`

#### db-migrate
`npm install -g db-migrate`


#### cors
`npm install --save cors`

#### bcrypt
`npm -i bcrypt`
`npm -i -D @types/bcrypt`

#### jsonwebtoken
`npm install jsonwebtoken --sav`
`npm -i -D @types/jsonwebtoken`

#### cross-env
`npm install --save-dev cross-env`

#### jasmine
`npm install jasmine @types/jasmine @ert78gb/jasmine-ts ts-node --save-dev`

#### supertest
`npm i supertest`
`npm i --save-dev @types/supertest`


## Set up Database
### Create Databases
We shall create the dev and test database.

- connect to the default postgres database as the server's root user `psql -U postgres`
- In psql run the following to create a user 
    - `CREATE USER postgres WITH PASSWORD '12345';`
- In psql run the following to create the dev and test database
    - `CREATE DATABASE online_store_dev`
    - `CREATE DATABASE online_store_test;`
- Connect to the databases and grant all privileges
    - Grant for dev database
        - `\c online_store`
        - `GRANT ALL PRIVILEGES ON DATABASE online_store_dev TO postgres ;`
    - Grant for test database
        - `\c online_store_test`
        - `GRANT ALL PRIVILEGES ON DATABASE online_store_test TO postgres;`

### Migrate Database


## Enviromental Variables Set up
Bellow are the environmental variables that needs to be set in a `.env` file. This is the default setting that I used for development

**NB:** The given values are used in developement and testing but not in production. 
```
DB_NAME = online_store_dev
DB_NAME_TEST = online_store_test
DB_HOST = localhost
DB_USER = mahmoud
DB_PASS= password123
DB_PORT = 5432
BCRYPT_PASSWORD=Mahmoud123
SALT_ROUNDS=10
TOKEN_SECRET =myproject123
ENV = dev
```

## Start App
`yarn watch` or `npm run watch`


## Endpoint Access
All endpoints are described in the [REQUIREMENT.md](REQUIREMENTS.md) file. 

## Token and Authentication
Tokens are passed along with the http header as 
```
Authorization   Bearer <token>
```

## Testing
Run test with 

npm run test`

It sets the environment to `test`, migrates up tables for the test database, run the test then migrate down all the tables for the test database.


### Changing Enviroment to testing 
I had set up two databases, one for development and the other for testing. During testing, I had to make sure the testing database is used instead of the developement database. 

To acheive this, I set up a variable in the `.env` file which is by default set to `dev`. During testing, the command `yarn test` will set this variable to `testing` in the package.json. Here is the complete command.
`set ENV=test db-migrate --env test up && jasmine-ts && db-migrate db:drop test`

