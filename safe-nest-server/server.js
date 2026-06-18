const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Allow requests with no origin (Postman, mobile apps, server-to-server)
    if (!origin) return callback(null, true);
    // Allow any Vercel deployment (previews + production)
    if (origin.endsWith(".vercel.app")) return callback(null, true);
    // Allow exact origins from CLIENT_URL env var
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));

app.post("/test", (req, res) => {
  res.send("TEST ROUTE WORKING");
});

const { protect } = require("./middleware/authMiddleware");

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

app.get("/", (req, res) => {
  res.send("SafeNest API Running...");
});
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const roomRoutes = require("./routes/roomRoutes");
app.use("/api/rooms", roomRoutes);

const entryRoutes = require("./routes/entryRoutes");
app.use("/api/entry", entryRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const sosRoutes = require("./routes/sosRoutes");
app.use("/api/sos", sosRoutes);

const studentRoutes = require("./routes/studentRoutes");
app.use("/api/student", studentRoutes);

const complaintRoutes = require("./routes/complaintRoutes");

app.use("/api/complaints", complaintRoutes);

const rentRoutes = require("./routes/rentRoutes");
app.use("/api/rent", rentRoutes);

const chatbotRoutes = require("./routes/chatbotRoutes");
app.use("/api/chatbot", chatbotRoutes);

const qrRoutes = require("./routes/qrRoutes");
app.use("/api/qr", qrRoutes);

const superAdminRoutes = require("./routes/superAdminRoutes");
app.use("/api/superadmin", superAdminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
