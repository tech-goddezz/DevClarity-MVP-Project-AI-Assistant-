export const analyzeCode = (req, res) => {
  
    const { code } = req.body;

  if (!code) {
    return res.json({
      status: "error",
      message: "No code provided"
    });
  }


  let issues = [];
  let suggestions = [];
  let score = 10;


//   the basic analysis rules
  
 if (code.includes("console.log")) {
    issues.push("Avoid console.log in production code");
    suggestions.push("Use proper logging tools or remove debug logs");
    score -= 2;
  } 
  
  if (code.length < 20) {
    issues.push("Code is too short or incomplete");
    suggestions.push("Write more meaningful logic before analyzing");
    score -= 3;
  } 
  
  if (!code.includes("return")) {
    issues.push("Missing return statement (if function-based logic)");
    suggestions.push("Ensure functions return values where needed");
    score -= 1;
  } 
  
  if (issues.length === 0) {
    suggestions.push("Great job! Code looks clean and structured");
  }

   return res.json({
    status: "success",
    score,
    issues,
    suggestions,
    summary:
      score >= 8
        ? "Excellent code quality!"
        : score >= 5
        ? "Good, but needs improvement!"
        : "Needs significant improvements!"
  });
};