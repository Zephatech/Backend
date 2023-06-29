# UWTrade Backend

The backend service for the student-to-student trading platform which intends to save users' money and time.

## Table of Contents

- [Introduction](#introduction)
- [File Structure](#file-structure)
- [Setup](#setup)
  - [Application Setup](#application-setup)
  - [Database Setup](#database-setup)
- [Documentation](#documentation)
  - [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Marketplace](#marketplace)
  - [Trade](#trade)
- [Contributer](#contributer)
- [License](#license)

## Introduction

To help students save money and reduce waste, we are creating UWTrade, a centralized, student-to-student platform for buying and selling university-oriented used goods. \
This repo will be the backend service of the UWTrade platform, which handles the database and CRUD operations .

## Project Structure

The following is the structure of the project's files and directories.

```
app.js:
  Entry point of the application.
config/:
  Directory containing configuration files.
controllers/:
  Directory containing the application's controllers.
entities/:
  Directory containing the entities for TypeORM to synchronize and create the tables as defined in this folder.
middleware/:
  Directory containing custom middleware functions, such as security verification middleware.
models/:
  Directory containing the application's models, which is responsible to implement the CRUD operations.
routes/:
  Directory containing the application's routes, which provides API for the front-end application to call.
utils/:
  Directory containing all the shared util functions
types:
  Directory containing the customized types.
README.md:
  This file, which explains the project.
```

## Setup

The following are the instructions on how to set up the application and the database.

### Application Setup

1. Clone the repository:

```
git clone https://github.com/Zephatech/Backend.git
# or
git clone git@github.com:Zephatech/Backend.git
```

2. Install the dependencies:

```
cd <project-directory>
npm install
```

3. Start the application:

```
npm start
```

### Database Setup

Provide instructions on how to set up and configure the database.

1. Install PostgreSQL.

```
Visit https://www.postgresql.org/download/ to install PostgreSQL on your machine.
```

2. Create a new database.

```
$ psql -U postgres                    # open PostgresSQL cli
postgres=# CREATE DATABASE UWTRADE;   # use the suggested name 'UWTRADE'
```

3. Configure the database connection. \
   Update the `config/database.js` file with the database connection details.

```
The suggested fields are:
{
  host: "localhost",
  port: 5432,
  username: "admin",
  password: "test",
  database: "UWTRADE",
}
```

4. (Optional) Seed the database with sample data:

```
npm run seed
```

## Documentation

Here is the [document](https://docs.google.com/document/d/1PB7UbdsNjgnukX7bS5LFWs7b6LLI4LPXU7PcPP-Y-gA/edit) that detailed explains our project.
The following are the information regarding low-level designs in this back-end project.

### a. API Endpoints

Currently, there are three groups of endpoints: authentication, marktetplace, and trade. They are implemented in 'src/routes/', using functions from the 'src/controllers/' as handlers.\
To add more endpoints, please do so in the 'src/routes/' directory. \
If you need more functions for task handling, please visit the 'src/controllers/' and the 'src/models/' folder.

### b. Authentication

TODO: define the which aspects require authentication; research and compare options to resolve each security challenge.

### c. Marketplace

TODO: provide more robust and versitile solutions to handle front-end requirements; simplify the marketplace handling logic for expendability.

### d. Trade

TODO: compare the trading logic and re

## Contributer

Hubert Zhu,
Ryan Deng,
Lizhuo You,
Zuoqiu Liu
