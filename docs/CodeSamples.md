# Code Samples that uses this API backend endpoints

`/api/investors` without query parameters

```javascript
const axios = require('axios');

let config = {
  method: 'get',
  url: 'http://localhost:9999/api/investors',
  headers: {}
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
```

`/api/investors` with query parameters

```javascript
const axios = require('axios');

let config = {
  method: 'get',
  url: 'http://localhost:9999/api/investors?page=1&limit=5&order=desc&orderBy=balance',
  headers: {}
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
```

`/api/investors/:walletAddress`

```javascript
const axios = require('axios');

let config = {
  method: 'get',
  url: 'http://localhost:9999/api/investors/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  headers: {}
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
```

`/api/transactions/` without query parameters

```javascript
const axios = require('axios');

let config = {
  method: 'get',
  url: 'http://localhost:9999/api/transactions',
  headers: {}
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
```

`/api/transactions` with query parameters

```javascript
const axios = require('axios');

let config = {
  method: 'get',
  url: 'http://localhost:9999/api/transactions?page=1&limit=5&type=investment&orderBy=timestmp&order=DESC',
  headers: {}
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
```

`/api/transactions/:walletAddress`

```javascript
const axios = require('axios');

let config = {
  method: 'get',
  url: 'http://localhost:9999/api/transactions/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266?page=1&limit=5&type=redemption&orderBy=timestmp&order=DESC',
  headers: {}
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
```

`/api/metrics`

```javascript
const axios = require('axios');

let config = {
  method: 'get',
  url: 'http://localhost:9999/api/metrics',
  headers: {}
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
```

`/api/metrics/history`

```javascript
const axios = require('axios');

let config = {
  method: 'get',
  url: 'http://localhost:9999/api/metrics/history?timerange=3m&page=2&limit=10',
  headers: {}
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
```

`/api/reporting`

```javascript
const axios = require('axios');

let config = {
  method: 'get',
  url: 'http://localhost:9999/api/reporting',
  headers: {}
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
```

`/api/health`

```javascript
const axios = require('axios');

let config = {
  method: 'get',
  url: 'http://localhost:9999/api/health',
  headers: {}
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
```
