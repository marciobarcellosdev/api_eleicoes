$(document).ready(function(e) {
  $("#formConfig").on('submit', async function(e) {
    e.preventDefault();
    const arquivoJSON = document.getElementById("UploadArquivoJSON")
    var formData = new FormData(this);
    formData.append("UploadArquivoJSON", arquivoJSON.files[0])
    
    let endPoint;
    const endPointConfig = "/api/eleicao";
    const endPointImportacao = "/api/eleicao/importacoes-secoes";

    var validaEndPoint = $("#valida-endpoint").attr('name');
    //console.log(validaEndPoint);
  
    if(validaEndPoint === 'apieleicao') endPoint = endPointConfig;
    if(validaEndPoint === 'apieleicaoimportacoessecoes') endPoint = endPointImportacao;
    
    const url = host + endPoint;

    const requestOptions = {
      method: 'POST',
      body: formData
    };

    var request = async () => {
      var tmpFetch = await fetch(url, requestOptions)
      .then((response) => response.json())
      .catch(error => console.error(error));
      return tmpFetch;
    };
    var resultPromise = await request('PromiseResult');

    $('#RetornoUploadMessage').text('');
    $('#RetornoUploadError').text('');
    $('#RetornoUploadArquivo').text('');

    if(resultPromise.msgSucesso != null){
      $('#RetornoUploadMessage').text(resultPromise.msgSucesso);
    }
    if(resultPromise.msgErro != null){
      $('#RetornoUploadError').text(resultPromise.msgErro);
    }
    $('#RetornoUploadArquivo').text(resultPromise.filename);
  });
});

