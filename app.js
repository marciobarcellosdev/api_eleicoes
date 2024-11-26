
//https://blog.postman.com/how-to-create-a-rest-api-with-node-js-and-express/
//https://runjs.app/blog/how-to-start-a-node-server

const cors = require('cors');
const express = require('express');
const fs = require('fs');
const mongoose = require("mongoose");
const multer = require('multer');
const path = require('path');
const mongoClient = require('mongodb').MongoClient;
//const swaggerUI = require('swagger-ui-express');
//const swaggerSpec = require('./swagger');
const moment = require("moment");

const baseUrl = "mongodb://localhost:27017/";
const base = "api_eleicoes";
const baseUrlDb = baseUrl + base;
const baseCollectionConfig = "eleicoes_config";
const baseCollectionImportacao = "eleicoes_importacao";

const app = express();
const PORT = 3039;
// app.requestTimeout = 5000;
// app.headersTimeout = 4000;
// app.keepAliveTimeout = 3000;
// app.timeout = 3000;

// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /cors
//https://medium.com/@highlanderfullstack/um-guia-para-cors-em-node-js-com-express-b576c71c50ea
app.use(cors({
  origin: '*'
}));


// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /swagger
//app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerSpec));


// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, moment().format("YYYY-MM-DD_HH-mm-ss") + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /.gif|.json/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  if (extname) {
    return cb(null, true);
  } else {
    cb('Not JSON file');
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 100000 }, // 100 KB
  //limits: { fileSize: 1000000 }, // 1 MB
});


// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /
app.get("/", (req, res) => {
  res.send("...");
});

// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /status
app.get("/status", (req, res) => {
  const status = {
    "Server status": "Running",
    // "server.requestTimeout": app.requestTimeout,
    // "server.headersTimeout": app.headersTimeout,
    // "server.keepAliveTimeout" : app.keepAliveTimeout,
    // "server.timeout" : app.timeout
  }
  res.send(status);
});

// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /statusdb
app.get("/statusdb", (req, res) => {
  mongoose.connect(baseUrlDb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => res.send("Conectou no banco de dados"))
  .catch((err) => res.send("Erro ao conectar no banco de dados"));
  //mongoose.disconnect();
});

// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /find -- PENDING
// app.get("/find", (req, res) => {
//   mongoClient.connect(baseUrl).then((client) => {
//     const connect = client.db(base);
//     const collection = connect.collection(baseCollection);

//     async function find() {
//       const result = await collection.find();
//       res.send(result);
//       //console.log('Found document:', result);
//     }
//     find();
//     //let resultQuery = collection.find({}).toArray();
//   }).catch(err => {
//     res.send(err.Message);
//   });
// });


// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /collection/eleicoes_config/findOne
// https://www.mongodb.com/pt-br/docs/manual/reference/method/db.collection.insertOne/
app.get("/collection/" + baseCollectionConfig + "/findOne", (req, res) => {
  mongoClient.connect(baseUrl).then((client) => {
    const connect = client.db(base);
    const collection = connect.collection(baseCollection);
    const nameTmp = req.query.name;
    
    async function findOne(_name) {
      const query = { name: _name };
      const result = await collection.findOne(query);
      res.send(result);
    }
    findOne(nameTmp);
  }).catch(err => {
    res.send(err.Message);
  });
});

// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /api/eleicao
app.post('/api/eleicao', function (req, res) {
  const uploadTmp = upload.single('UploadArquivoJSON');
  uploadTmp(req, res, function (err) {

    req.socket.setTimeout(5 * 60 * 1000);

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ msgErro: err.message });
    } else if (err) {
      return res.status(500).json({ msgErro: err });
    }
    
    if (!req.file) {
      res.status(400).json({ msgErro: 'Nenhum arquivo foi selecionado' });
    }else{
      var rawdata = fs.readFileSync(req.file.path);
      var conteudoArquivo = JSON.parse(rawdata);
      //console.log(punishments);

      mongoClient.connect(baseUrl).then((client) => {
        const connect = client.db(base);
        const collection = connect.collection(baseCollectionConfig);
        collection.insertOne({conteudoArquivo});
        console.log('Insertion Successful /api/eleicao')
      }).catch(err => {
        console.log(err.Message);
      });
  
      res.json({ msgSucesso: 'Arquivo de configuração importado com sucesso!', filename: req.file.filename });
    }
  })
})

// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /api/eleicao/importacoes-secoes
app.post('/api/eleicao/importacoes-secoes', function (req, res) {
  const uploadTmp = upload.single('UploadArquivoJSON');
  uploadTmp(req, res, function (err) {
    
    req.socket.setTimeout(5 * 60 * 1000);

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ msgErro: err.message });
    } else if (err) {
      return res.status(500).json({ msgErro: err });
    }

    if (!req.file) {
      res.status(400).json({ msgErro: 'Nenhum arquivo foi selecionado' });
    }else{
      var rawdata = fs.readFileSync(req.file.path);
      var conteudoArquivo = JSON.parse(rawdata);
      //console.log(punishments);
  
      mongoClient.connect(baseUrl).then((client) => {
        const connect = client.db(base);
        const collection = connect.collection(baseCollectionImportacao);
        collection.insertOne({conteudoArquivo});
        console.log('Insertion Successful /api/eleicao/importacoes-secoes')
      }).catch(err => {
        console.log(err.Message);
      });
  
      res.json({ msgSucesso: 'Arquivo com resultados importado com sucesso!', filename: req.file.filename });
    }
  })
})


app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});



// mongoClient.connect(baseUrl).then((client) => {
//   const connect = client.db(base);
//   const collection = connect.collection(baseCollection);
//   collection.insertOne({ 
//       "name": "aayush", "class": "GFG" });
//   collection.insertMany([
//       { "name": "saini", "class": "GFG" }, 
//       { "name": "GfGnew", "class": "GFGNEW" }
//   ]);
//   console.log("Insertion Successful")
// }).catch(err => {
//   // If error occurred show the error message
//   console.log(err.Message);
// });

// if(err.code === 'LIMIT_FILE_SIZE'){
//   console.error('é o erro de limite');
// }

// let rawdata = fs.readFileSync(req.file);
// let punishments = JSON.parse(rawdata);
//console.log(punishments);

///api/eleicao

// collection.insertOne({ 
//     "nomeEleicao": "Para presidente", 
//     "candidatos": ["Candidato Um", "Candidato Dois"],
//     "zonasEleitorais": 
//     [
//       {"idZona" : "169", 
//        "secoes" : 
//        [
//           {"idSecao": "01", 
//            "quantidadeEleitores" : 39}
//       ]}
//     ]
// });

///api/eleicao/importacoes-secoes

// collection.insertOne({ 
//     "idSecao": "01", 
//     "quantidadePresentes": 2,
//     "votosValidos": 36,
//     "candidatos": 
//     [
//       {"nomeCandidato": "Candidato Um",
//       "quantidadeVotos": 20}
//     ]
// });
