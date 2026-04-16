const mongoose = require("mongoose");

const connectMongo = async () => {
  const uri =
    process.env.NODE_ENV === "test"
      ? process.env.MONGODB_URI_TEST || process.env.MONGODB_URI
      : process.env.MONGODB_URI;

  await mongoose.connect(uri);
};

module.exports = connectMongo;
