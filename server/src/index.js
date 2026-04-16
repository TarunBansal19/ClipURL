require("dotenv").config();
const app = require("./app");
const connectMongo = require("./db/mongoose");
const { connectRedis } = require("./db/redis");

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectMongo();
    await connectRedis();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

start();
