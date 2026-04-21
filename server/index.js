import express from "express";
import cors from "cors";

// yes ive connected it..if i now want to continue pushing from now, how do i do it, when i have coded some changes and i want to push to github

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Devclarity Server is Running!");
});

app.post("/analyze", (req, res) => {
  const { code } = req.body;

  res.json({
    message: "Code received",
    code: code
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});