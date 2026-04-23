export const analyzeCode = (req, res) => {
  
    const { code } = req.body;

  if (!code) {
    return res.json({
      status: "error",
      message: "No code provided"
    });
  }

  let feedback = "";

  if (code.includes("console.log")) {
    feedback = "Avoid console.log in production code";
  } else if (code.length < 20) {
    feedback = "Code looks too short. Add more logic";
  } else {
    feedback = "Code looks good 👍";
  }

  res.json({
    status: "success",
    feedback: feedback
  });
};