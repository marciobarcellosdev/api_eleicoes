$(document).ready(function(e) {
  
  $("#formConfig").on('submit', async function(e) {
    e.preventDefault();
    const arquivoJSON = document.getElementById("UploadArquivoJSON")
    var formData = new FormData(this);
    formData.append("UploadArquivoJSON", arquivoJSON.files[0])
    
    //const url = "http://localhost:3039/upload";
    const url = "http://projectdev.services:3039/upload";
    const requestOptions = {
      method: 'POST',
      body: formData
    };

    var request = async () => {
      var tmpFetch = await fetch(url, requestOptions)
      .then((response) => response.json());
      //.catch(error => console.error(error));
      return tmpFetch;
    };
    var resultPromise = await request('PromiseResult');

    $('#RetornoUploadMessage').text(resultPromise.message);
    $('#RetornoUploadArquivo').text(resultPromise.filename);
    console.log(resultPromise);
  });
});

    //const url = "http://localhost:3039/status";

    // const requestOptions = {
    //   method: 'GET'
    // };

    // fetch(url, requestOptions)
    // .then(response => {
    //   console.log(response.json());
    //   $('#EnviarJSONRetorno').text(response.json);
    // })
    // .then(data => {
    //   console.log(data);
    //   $('#EnviarJSONRetorno').text(data);
    // })
    // .catch(error => console.error('ERRO: ' + error));

  // https://blog.logrocket.com/multer-nodejs-express-upload-file/

        //https://javascript.info/fetch
    // fetch(url, requestOptions)
    // .then(response => {
      
    //   //var storageres = response.body;
    //   //var storageres2 = response.json();
      
    //   //console.log(storageres);
    //   //console.log(storageres2);
    //   //$('#EnviarJSONRetorno').text(response.json());
    // })
    // .then(data => {
    //   console.log('DATA:' + data);
    //   //$('#EnviarJSONRetorno').text(data.message);
    // })
    // .catch(error => console.error(error));

