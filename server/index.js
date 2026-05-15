const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const server = http.createServer(app);

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const DEPLOYED_FRONTEND_ORIGIN =
  process.env.DEPLOYED_FRONTEND_ORIGIN || "https://luna-petals.vercel.app";
const allowedOrigins = [FRONTEND_ORIGIN, DEPLOYED_FRONTEND_ORIGIN].filter(
  Boolean,
);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS not allowed: ${origin}`));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};

const io = new Server(server, {
  cors: corsOptions,
});

// Connect MongoDB
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/upload", require("./routes/upload"));

// Socket.io
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-order", (orderId) => {
    socket.join(orderId);
    console.log(`Client joined order room: ${orderId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Make io accessible in controllers
app.set("io", io);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Luna Petals API running 🌸" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
