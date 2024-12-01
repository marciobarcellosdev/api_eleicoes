
const cors = require('cors');
const express = require('express');
const moment = require("moment");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoClient = require('mongodb').MongoClient;
const mongoose = require("mongoose");
//const swaggerUI = require('swagger-ui-express');
//const swaggerSpec = require('./swagger');
//var enforce = require('express-sslify');

//const baseUrl = "mongodb://localhost:27017/";
const baseUrl = "mongodb+srv://steamadd1:0MMqgGjRNOtO9gsr@cluster0.jt4zn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const base = "api_eleicoes";
const baseUrlDb = baseUrl + base;
const baseCollectionConfig = "eleicoes_config";
const baseCollectionImportacao = "eleicoes_importacao";

const app = express();
const PORT = 3039;
// app.requestTimeout = 21000;
// app.headersTimeout = 21000;
// app.keepAliveTimeout = 21000;
// app.timeout = 21000;

// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /cors
//https://medium.com/@highlanderfullstack/um-guia-para-cors-em-node-js-com-express-b576c71c50ea
app.use(cors({origin: '*'}));

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


// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /status [GET]
app.get("/status", (req, res) => {
  const status = {
    "ServerStatus": "Running yes",
    // "server.requestTimeout": app.requestTimeout,
    // "server.headersTimeout": app.headersTimeout,
    // "server.keepAliveTimeout" : app.keepAliveTimeout,
    // "server.timeout" : app.timeout
  }
  res.send(status);
});

// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /statusdb [GET]
app.get("/statusdb", (req, res) => {
  mongoose.connect(baseUrlDb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => res.send("Conectou no banco de dados"))
  .catch((err) => res.send("Erro ao conectar no banco de dados"));
  //mongoose.disconnect();
});

// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /collection/find/eleicoes_config [GET]
app.get("/collection/find/eleicoes_config", (req, res) => {
  console.log('res.query: ' + JSON.stringify(req.query));
  
  mongoClient.connect(baseUrl).then((client) => {
    const connect = client.db(base);
    const collection = connect.collection(baseCollectionConfig);
    const filtroTmp = req.query.nomeeleicao;
    
    async function find(_filtro) {
      const query = { nomeEleicao: _filtro };
      let cursor;

      if(filtroTmp == '' || !res.query){
        cursor = await collection.find();
      }else{
        cursor = await collection.find(query);
      }

      const documentos = await cursor.toArray();
      res.send(documentos);
    }
    find(filtroTmp);

  }).catch(err => {
    res.send(err.Message);
  });
});

// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /collection/find/eleicoes_importacao [GET]
app.get("/collection/find/eleicoes_importacao", (req, res) => {
  console.log('res.query: ' + JSON.stringify(req.query));
  
  mongoClient.connect(baseUrl).then((client) => {
    const connect = client.db(base);
    const collection = connect.collection(baseCollectionImportacao);
    const filtroTmp = req.query.idsecao;
    
    async function find(_filtro) {
      const query = { idSecao: _filtro };
      let cursor;

      if(filtroTmp == '' || !res.query){
        cursor = await collection.find();
      }else{
        cursor = await collection.find(query);
      }

      const documentos = await cursor.toArray();
      res.send(documentos);
    }
    find(filtroTmp);

  }).catch(err => {
    res.send(err.Message);
  });
});

// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /collection/findOne/eleicoes_config [GET]
//app.get("/collection/" + baseCollectionConfig + "/findOne", (req, res) => {
app.get("/collection/findOne/eleicoes_config", (req, res) => {
  console.log('res.query: ' + JSON.stringify(req.query));

  mongoClient.connect(baseUrl).then((client) => {
    const connect = client.db(base);
    const collection = connect.collection(baseCollectionConfig);
    const nomeeleicaoTmp = req.query.nomeeleicao;
    
    async function findOne(_nomeeleicao) {
      const query = { nomeEleicao: _nomeeleicao };
      const result = await collection.findOne(query);
      res.send(result);
    }
    findOne(nomeeleicaoTmp);
  }).catch(err => {
    res.send(err.Message);
  });
});

// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /collection/findOne/eleicoes_importacao [GET]
app.get("/collection/findOne/eleicoes_importacao", (req, res) => {
  console.log('res.query: ' + JSON.stringify(req.query));

  mongoClient.connect(baseUrl).then((client) => {
    const connect = client.db(base);
    const collection = connect.collection(baseCollectionImportacao);
    const idsecaoTmp = req.query.idsecao;
    
    async function findOne(_idsecao) {
      const query = { idSecao: _idsecao };
      const result = await collection.findOne(query);
      res.send(result);
    }
    findOne(idsecaoTmp);
  }).catch(err => {
    res.send(err.Message);
  });
});

// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /api/eleicao [POST]
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

// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /api/eleicao/resultados [GET]
app.get('/api/eleicao/resultados', function (req, res) {
  
})


// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /api/eleicao/importacoes-secoes [POST]
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

// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /api/eleicao/importacoes-secoes [GET]
app.get("/api/eleicao/importacoes-secoes", (req, res) => {
  // console.log('res.query: ' + JSON.stringify(req.query));
  //console.log('res.headers s: ' + JSON.stringify(req.headers));
  console.log('req.headers.parametrozona: ' + req.headers.parametrozona);
  console.log('req.headers.parametrosecao: ' + req.headers.parametrosecao);

  mongoClient.connect(baseUrl).then((client) => {
    const connect = client.db(base);
    const colConfig = connect.collection(baseCollectionConfig);
    const colImportacao = connect.collection(baseCollectionImportacao);
    const filtroZona = req.headers.parametrozona;
    const filtroSecao = req.headers.parametrosecao;

    console.log('filtroZona: ' + filtroZona);
    console.log('filtroSecao: ' + filtroSecao);
    
    async function find(_filtroZona, _filtroSecao) {
      let queryConfig;
      let queryImportacao;


      if(_filtroSecao == '' || _filtroSecao === undefined){
        queryImportacao = {  };
        console.log('sem conteudo');
      }else{
        queryImportacao = { 'conteudoArquivo.idSecao': _filtroSecao };
        console.log('com conteudo');
      }

      if(_filtroZona == '' || _filtroZona === undefined){
        queryConfig = {  };
        console.log('sem conteudo');
      }else{
        queryConfig = { 'conteudoArquivo.idSecao': _filtroZona };
        console.log('com conteudo');
      }



      let findConfig;
      let findImportacao;

      findConfig = await colConfig.find({}, {});
      findImportacao = await colImportacao.find(queryImportacao, {});

      const cursorConfig = await findConfig.toArray();
      const cursorImportacao = await findImportacao.toArray();
      
      var objConfig = JSON.parse(JSON.stringify(cursorConfig[0]));
      var objImportacao = JSON.parse(JSON.stringify(cursorImportacao));

      // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . JSON data - totalSecoes
      function getTotalSecoes() {
        var count = 0;
        objConfig.conteudoArquivo.zonasEleitorais.forEach((z) => {
          z.secoes.forEach((s) => {
            count++;
          });
        });
        return count;
      }
      var totalSecoes = getTotalSecoes();

      // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . JSON data - secoesImportadas
      function getSecoesImportadas() {
        var count = 0;
        objImportacao.forEach((o) => {
          count++;
        });
        return count;
      }
      var secoesImportadas = getSecoesImportadas();

      // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . JSON data - totalEleitoresPresentes
      function getTotalEleitoresPresentes() {
        var count = 0;
        objImportacao.forEach((o) => {
          count += o.conteudoArquivo.quantidadePresentes;
        });
        return count;
      }
      var totalEleitoresPresentes = getTotalEleitoresPresentes();

      // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . JSON data - percentualPresentes
      function getPercentualPresentes() {
        var countQtd = 0;
        var countVotos = 0;
        var percentual = 0;
        objImportacao.forEach((o) => {
          countQtd += o.conteudoArquivo.quantidadePresentes;
          countVotos += o.conteudoArquivo.votosValidos;
        });
        percentual = (countQtd/countVotos) * 100;
        return percentual.toFixed(2);
      }
      var percentualPresentes = getPercentualPresentes();

      // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . JSON data - totalAbstencoes
      function getTotalAbstencoes() {
        var countQtd = 0;
        var countVotos = 0;
        objImportacao.forEach((o) => {
          countQtd += o.conteudoArquivo.quantidadePresentes;
          countVotos += o.conteudoArquivo.votosValidos;
        });

        return countVotos - countQtd;
      }
      var totalAbstencoes = getTotalAbstencoes();

      // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . JSON data - percentualAbstencoes **
      function getPercentualAbstencoes() {
        var countQtd = 0;
        var countVotos = 0;
        var countAbstencoes = 0;
        var percentual = 0;
        objImportacao.forEach((o) => {
          countQtd += o.conteudoArquivo.quantidadePresentes;
          countVotos += o.conteudoArquivo.votosValidos;
        });
        countAbstencoes = countVotos - countQtd;
        percentual = (countAbstencoes/countVotos) * 100;
        return percentual.toFixed(2);
      }
      var percentualAbstencoes = getPercentualAbstencoes();
      


      const jsonRetorno = [
      {
        "totalSecoes": totalSecoes,
        "secoesImportadas": secoesImportadas,
        "totalEleitoresPresentes": totalEleitoresPresentes,
        "percentualPresentes": percentualPresentes,
        "totalAbstencoes": totalAbstencoes,
        "percentualAbstencoes": percentualAbstencoes
      }];
      
      res.send(jsonRetorno);
      //res.json({ msgSucesso: jsonRetorno });
    }
    find(filtroZona, filtroSecao);

  }).catch(err => {
    res.send(err.Message);
  });
});


//app.use(enforce.HTTPS()); // not work
//app.use(enforce.HTTPS({ trustProtoHeader: true }));

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});




// BKP NÃO REMOVER

// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . /collection/eleicoes_config/findOne
// https://www.mongodb.com/pt-br/docs/manual/reference/method/db.collection.insertOne/
// app.get("/collection/" + baseCollectionConfig + "/findOne", (req, res) => {
  
//   console.log('res.query: ' + JSON.stringify(req.query));
//   //console.log('res.headers s: ' + JSON.stringify(req.headers));

//   mongoClient.connect(baseUrl).then((client) => {
//     const connect = client.db(base);
//     const collection = connect.collection(baseCollectionConfig);
//     const nameTmp = req.query.nomeeleicao;
    
//     async function findOne(_name) {
//       const query = { nomeEleicao: _name };
//       const result = await collection.findOne(query);
//       res.send(result);
//     }
//     findOne(nameTmp);
//   }).catch(err => {
//     res.send(err.Message);
//   });
// });

