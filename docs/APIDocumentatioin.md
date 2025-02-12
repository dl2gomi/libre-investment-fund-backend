# API Documentation

This is API documentation of this Restful API backend service.

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

**@ Returns** investors ordered and paginated.
If no query parameters specified, it returns all the investors.

`GET /api/investors/:walletAddress`

**@Query Params** None

**@Returns** an Investor with Wallet

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

## Metrics

`GET /api/metrics`

**@Query Params** None

**@Returns** the latest metrics

`GET /api/metrics/history`

**@Query Params**

| Params | Available values                               |
| ------ | ---------------------------------------------- |
| page   | Number                                         |
| limit  | Number                                         |
| range  | '1d', '1w', '1m', '3m' , '1y' , 'all'(default) |
|        |                                                |

**@Returns** history of metrics with pagination for a specified time range

## Others

`GET /api/reporting`

**@Query Params** None

**@Returns** basic reports about this platform.

`GET /api/health`

**@Query Params** None

**@Returns** a JSON response. Used for checking health of this service
