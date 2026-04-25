import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import analyzeRoute from "./routes/analyzeRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

// the test route
app.get("/", (req, res) => {
  res.send("DevClarity Backend is running..thank ");
});

// the message route
app.get("/api/message", (req, res) => {
  res.json({
    message: "Hello from DevClarity Backend! welcome",
    status: "success"
  });
});

// the IMPORTANT PART
app.use("/api", analyzeRoute);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});