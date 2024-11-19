
//https://blog.postman.com/how-to-create-a-rest-api-with-node-js-and-express/
//https://runjs.app/blog/how-to-start-a-node-server

const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = 3039;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

//https://medium.com/@highlanderfullstack/um-guia-para-cors-em-node-js-com-express-b576c71c50ea
app.use(cors({
  origin: '*'
}));

app.get("/", (req, res) => {
  res.send("Hello from Express! 66");
});
app.get("/status", (req, res) => {
  const status = {
    "Status": "Running"
  }
  res.send(status);
});


// https://dev.to/malikbilal111/building-a-file-upload-rest-api-with-nodejs-and-express-56l2
app.post('/upload', upload.single('UploadArquivoJSON'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Arquivo não enviado' });
  }
  res.json({ message: 'Arquivo de configuração importado com sucesso!', filename: req.file.filename });
});



app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});




