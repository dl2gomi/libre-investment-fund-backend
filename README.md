# Libre-Investment-Funds-Backend

This is a home assignment project for Libre technical tests.
This backend service handles blockchain interaction reliably and keep the database in sync with the blockchain state. It caches fund metrics appropriately and maintains transaction records as well.

## Description

This project is a backend service to manage investments in a fund through a smart contract. The system handles basic investment and redemption operations, tracking the fund's value and investor positions.

## Features

- Processes investments and redemptions
- Tracks fund metrics
- Records transaction history
- Provides basic reporting

## Project setup

This project uses **Node.js** as the infrastructure, **MySQL** as database and **Redis** as cache.

To install the project dependencies, run the following command in your terminal:

```bash
npm install
```

## Configure DB and Cache

This project uses MySQL for DB and Redis for cache. `.env` file needs to include configuration details for connecting DB and Cache.

```bash
NODE_ENV=development

PORT=9999

DB_USERNAME=root
DB_PASSWORD=
DB_NAME=investment_fund_db
DB_HOST=127.0.0.1
DB_DIALECT=mysql
DB_PORT=3306

RPC_URL=http://localhost:8545
WS_RPC_URL=ws://localhost:8545
PRIVATE_KEY=0xprivatekey
CONTRACT_ADDRESS=0xdeployedcontractaddress

REDIS_URL=redis://default:V07CoP9QwOaINFQm0S0vpcXS4bRhk2vw@redis-17685.c326.us-east-1-3.ec2.redns.redis-cloud.com:17685

```

MySQL DB needs to be run before executing the commands in the following repository.
MySQL database can be migrated using the following command:

```
npx sequelize-cli db:migrate
```

## Run the blockchain and deploy the FundToken smart contract

This backend service interacts with a smart contract deployed to a blockchain. To locally run this project, a local blockchain or testnet blockchain need to be used to deploy the smart contract.

This repository has the smart contract code and detailed explanation about how to run and deploy the smart contract.

[Visit the smart contract repository](https://github.com/dl2gomi/libre-investment-fund-contracts)

## Run servers

This backend service uses event-driven approach for blockchain investment and redemption acknowledgement, which is different from normal approaches, that the backend is notified about the events from the frontend.

Thus, this project has 2 servers: one for listening to events of the Fund smart contract and the other for listening to API requests.

To run this project, run these 2 following commands in 2 separate terminals:

```bash
npm run start:api
```

```bash
npm run start:chain
```

## Simulate transactions

To simulate investment and redemption transactions, run this command in the [smart contract repository](https://github.com/dl2gomi/libre-investment-fund-contracts)

```bash
npx hardhat run ./scripts/demo.js --network localhost
```

## API documentation

You can check [API Documentation here](docs/APIDocumentation.md)

## Implementation documentation

You can check [Implementation Documentation here](docs/project.pdf) to look at architecture design, DB design and components interaction.

## Code samples

You can check [Code Samples here](docs/CodeSamples.md) to look at example code snippets that uses this API endpoints.

## Assumptions & Simplicity

- Auth functionalities are not implemented after asking questions.
- All transactions made in the smart contract are assumed to be finalized to success. In a production mode, this needs to be considered. This is a crucial factor.
- setSharePrice function is implemented in the smart contract code though it is not mentioned in the requirements document, but it is never used in this project.
- Redis cloud has been used for caching and all the credentials are now in the `.env` file though I know it is not a recommended way in production mode.
