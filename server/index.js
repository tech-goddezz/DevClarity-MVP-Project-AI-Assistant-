import dotenv from "dotenv";
dotenv.config();

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


// done..but for the explanation, also doit this way, 
// say this code..if (trimmedCode.length > 12000)...
// which i know that it means, if the trimmed code is 
// greater than or more than 12000 in length, then return a response of error...you see the way i explained it, apart from the way you are already explaining it, also add this kind of explanation to them..i want to understand what the code means and is really dooing....
// done..but pls alwaays make sure to explain each block of code when explaining
