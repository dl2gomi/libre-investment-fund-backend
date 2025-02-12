# API Documentation

This is API documentation of this Restful API backend service.
This backend API endpoints returns responses in standardarized format.

### Success Case

```json
{
  success: true,
  message: A message describing the data.
  data: Data containing all the details required in the request.
}
```

### Error Case

```json
{
  success: false,
  message: A message describing the error.
  error: Error object.
}
```

In this documentation **@Returns** and **@Example** will explain about only `data` field in the response.

## Investor

`GET /api/investors`

**@Query Params**

| Params  | Available values                                          |
| ------- | --------------------------------------------------------- |
| page    | Number                                                    |
| limit   | Number                                                    |
| orderBy | 'balance', 'created_at'(default), 'last_transaction_time' |
| order   | 'desc', 'asc'                                             |
|         |                                                           |

**@Returns** investors ordered and paginated.
If no query parameters specified, it returns all the investors.

**@Example**

If no query parameters specified:

```json
[
  {
    "walletAddress": "0x71bE63f3384f5fb98995898A86B02Fb2426c5788",
    "balance": "500.000000",
    "createdAt": "2025-02-11T17:24:46.000Z",
    "lastTransactionTime": "2025-02-11T17:24:46.000Z"
  },
  {
    "walletAddress": "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
    "balance": "400.000000",
    "createdAt": "2025-02-11T17:24:26.000Z",
    "lastTransactionTime": "2025-02-11T17:24:58.000Z"
  }
]
```

If query parameters specified:

```json
{
  "totalItems": 10,
  "totalPages": 2,
  "currentPage": 1,
  "investors": [
    {
      "walletAddress": "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
      "balance": "900.000000",
      "createdAt": "2025-02-11T17:23:49.000Z",
      "lastTransactionTime": "2025-02-11T17:24:54.000Z"
    },
    {
      "walletAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "balance": "500.000000",
      "createdAt": "2025-02-11T17:22:20.000Z",
      "lastTransactionTime": "2025-02-11T17:23:33.000Z"
    }
  ]
}
```

`GET /api/investors/:walletAddress`

**@Query Params** None

**@Returns** an Investor with Wallet

**@Example**

```json
{
  "walletAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "balance": "500.000000",
  "createdAt": "2025-02-11T17:22:20.000Z",
  "lastTransactionTime": "2025-02-11T17:23:33.000Z"
}
```

## Transaction

`GET /api/transactions `

**@Query Params**

| Params  | Available values                   |
| ------- | ---------------------------------- |
| page    | Number                             |
| limit   | Number                             |
| type    | 'investment', 'redemption' or none |
| orderBy | 'timestamp'(default), 'usd_amount' |
| order   | 'desc', 'asc'                      |
|         |                                    |

**@Returns** transactions by combining pagination, ordering, filtering

**@Example**

```json
{
  "totalItems": 23,
  "totalPages": 3,
  "currentPage": 1,
  "transactions": [
    {
      "id": 38,
      "investorId": 18,
      "txId": "0xc4e09c4b75c1cc14de50d2a41c3f7871e1ce9c2c8d53ab662ccd0091b2aa6b3e",
      "transactionType": "redemption",
      "usdAmount": "100.000000",
      "shares": "100.000000",
      "timestamp": "2025-02-11T17:24:58.000Z",
      "createdAt": "2025-02-11T17:24:58.000Z",
      "updatedAt": "2025-02-11T17:24:58.000Z",
      "investor_id": 18,
      "investor": {
        "walletAddress": "0x976EA74026E726554dB657fA54763abd0C3a0aa9"
      }
    },
    {
      "id": 37,
      "investorId": 15,
      "txId": "0x0afd7fb02521ba8c2d00cd6708b8f36668c05392d3a6099dc6d7b98249f5f856",
      "transactionType": "investment",
      "usdAmount": "100.000000",
      "shares": "100.000000",
      "timestamp": "2025-02-11T17:24:54.000Z",
      "createdAt": "2025-02-11T17:24:54.000Z",
      "updatedAt": "2025-02-11T17:24:54.000Z",
      "investor_id": 15,
      "investor": {
        "walletAddress": "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955"
      }
    }
  ]
}
```

`GET /api/transactions/:walletAddress`

**@Query Params**

| Params  | Available values                   |
| ------- | ---------------------------------- |
| page    | Number                             |
| limit   | Number                             |
| type    | 'investment', 'redemption' or none |
| orderBy | 'timestamp'(default), 'usd_amount' |
| order   | 'desc', 'asc'                      |
|         |                                    |

**@Returns** transactions of a wallet by combining pagination, ordering, filtering

**@Example**

```json
{
  "totalItems": 6,
  "totalPages": 1,
  "currentPage": 1,
  "transactions": [
    {
      "id": 26,
      "investorId": 10,
      "txId": "0xb5b8556a9beae4ef50357f75e64f7c6e36baba889f6e33c73e97d55442dbc971",
      "transactionType": "redemption",
      "usdAmount": "100.000000",
      "shares": "100.000000",
      "timestamp": "2025-02-11T17:23:33.000Z",
      "createdAt": "2025-02-11T17:23:33.000Z",
      "updatedAt": "2025-02-11T17:23:33.000Z",
      "investor_id": 10
    },
    {
      "id": 25,
      "investorId": 10,
      "txId": "0xfaae5d9dbe8fd468b4f25e1e13d1f5ae5e160ee503683943a6953cdb666bb4ca",
      "transactionType": "investment",
      "usdAmount": "400.000000",
      "shares": "400.000000",
      "timestamp": "2025-02-11T17:23:25.000Z",
      "createdAt": "2025-02-11T17:23:25.000Z",
      "updatedAt": "2025-02-11T17:23:25.000Z",
      "investor_id": 10
    }
  ]
}
```

## Metrics

`GET /api/metrics`

**@Query Params** None

**@Returns** the latest metrics

**@Example**

```json
{
  "id": 44,
  "totalAssetValue": "4300.000000",
  "sharesSupply": "4300.000000",
  "sharePrice": "1.000000",
  "lastUpdateTime": "2025-02-11T17:24:58.000Z",
  "createdAt": "2025-02-11T17:24:58.000Z",
  "updatedAt": "2025-02-11T17:24:58.000Z"
}
```

`GET /api/metrics/history`

**@Query Params**

| Params | Available values                               |
| ------ | ---------------------------------------------- |
| page   | Number                                         |
| limit  | Number                                         |
| range  | '1d', '1w', '1m', '3m' , '1y' , 'all'(default) |
|        |                                                |

**@Returns** history of metrics with pagination for a specified time range

**@Example**

```json
{
  "totalItems": 25,
  "totalPages": 3,
  "currentPage": 2,
  "metrics": [
    {
      "id": 36,
      "totalAssetValue": "2700.000000",
      "sharesSupply": "2700.000000",
      "sharePrice": "1.000000",
      "lastUpdateTime": "2025-02-11T17:24:00.000Z",
      "createdAt": "2025-02-11T17:24:01.000Z",
      "updatedAt": "2025-02-11T17:24:01.000Z"
    },
    {
      "id": 35,
      "totalAssetValue": "2200.000000",
      "sharesSupply": "2200.000000",
      "sharePrice": "1.000000",
      "lastUpdateTime": "2025-02-11T17:23:53.000Z",
      "createdAt": "2025-02-11T17:23:53.000Z",
      "updatedAt": "2025-02-11T17:23:53.000Z"
    }
  ]
}
```

## Others

`GET /api/reporting`

**@Query Params** None

**@Returns** basic reports about this platform.

**@Example**

```json
{
  "totalUserCount": 10,
  "transactionVolInvest": 5300,
  "transactionVolRedeem": 1000,
  "topInvestors": [
    {
      "walletAddress": "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
      "balance": "900.000000"
    },
    {
      "walletAddress": "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
      "balance": "500.000000"
    }
  ],
  "latestMetrics": {
    "id": 44,
    "totalAssetValue": "4300.000000",
    "sharesSupply": "4300.000000",
    "sharePrice": "1.000000",
    "lastUpdateTime": "2025-02-11T17:24:58.000Z",
    "createdAt": "2025-02-11T17:24:58.000Z",
    "updatedAt": "2025-02-11T17:24:58.000Z"
  }
}
```

`GET /api/health`

**@Query Params** None

**@Returns** a fixed JSON response. Used for checking health of this service

**@Response** (This is the whole response, there is no `data` in this response.)

```json
{
  "success": true,
  "message": "API is running smoothly!"
}
```
