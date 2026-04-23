import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// the simple test route
app.get("/", (req, res) => {
  res.send("Devclarity Backend Server is Running! yahhhhh");
});

// the api route (very important!)
app.get("/api/message", (req, res) => {
  res.json({
    message: "Hello from DevClarity Backend!",
    status: "success"
  });
});



app.post("/api/analyze", (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.json({
      status: "error",
      message: "No code provided"
    });
  }

  // the Simple fake analysis (MVP logic)
  let feedback = "";

  if (code.includes("console.log")) {
    feedback = "Avoid console.log in production code";
  } else if (code.length < 20) {
    feedback = "Code looks too short. Add more logic";
  } else {
    feedback = "your Code looks good";
  }

  res.json({
    status: "success",
    feedback: feedback
  });
});



const PORT = 5000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});