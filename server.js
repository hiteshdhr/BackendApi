const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectMongo = require("./config/mongo");
const { connectMySQL, createUsersTable } = require("./config/postgres");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// connect to databases
connectMongo();
connectMySQL();
createUsersTable();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// basic route just to check if server is running
app.get("/", (req, res) => {
  res.json({ message: "Task Management API is running!" });
});

// global error handler - always keep this at the bottom
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
