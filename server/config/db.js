const dns = require("dns");
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dnsServers = process.env.MONGO_DNS_SERVERS?.split(",").map((s) =>
      s.trim(),
    ) || ["8.8.8.8", "1.1.1.1"];
    dns.setServers(dnsServers);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
