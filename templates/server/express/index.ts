import express from "express";

const app = express();
const port = {{PORT}};

app.get("/", (req, res) => {
  res.send("Hello from {{NAME}}");
});

app.listen(port, () => {
  console.log(`{{NAME}} listening at http://localhost:${port}`);
});
