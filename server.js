require('dotenv').config();

const app = require('./app');
const PORT = process.env.PORT || 5000;

// Start the Restful API server
app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});
