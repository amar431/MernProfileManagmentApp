import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import http from "http";
import { Server as SocketServer } from "socket.io";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoute.js";
import addressRoutes from "./routes/addressRoute.js";
import pictureRoutes from "./routes/profilePicture.js";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import cors from "cors";

dotenv.config();

connectDB();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3001", // Replace with your client-side domain
    credentials: true, // Allow cookies for authentication
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use("/uploads", express.static("./uploads"));
app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/admin/", adminRoutes);
app.use("/api/v1/", addressRoutes);
app.use("/api/v1/", pictureRoutes);

io.on("connection", (socket) => {
  console.log("New client connected");

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("hi welcome to profile managment");
});

server.listen(PORT, (req, res) => {
  console.log(`server started on ${PORT}`.bgCyan.white);
});
export {io}