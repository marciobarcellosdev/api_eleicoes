
//https://blog.postman.com/how-to-create-a-rest-api-with-node-js-and-express/
//https://runjs.app/blog/how-to-start-a-node-server

const express = require('express');

const app = express();
const PORT = 3039;

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.get("/status", (req, res) => {
  const status = {
    "Status": "Runing"
  }
  res.send(status);
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});



