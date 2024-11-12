
//https://blog.postman.com/how-to-create-a-rest-api-with-node-js-and-express/
//https://runjs.app/blog/how-to-start-a-node-server

const express = require('express');

const app = express();
const PORT = 3039;

app.get("/", (req, res) => {
  res.send("Hello from Express! 111");
});

app.get("/status", (req, res) => {
  const status = {
    "Status": "Running 111"
  }
  res.send(status);
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});




