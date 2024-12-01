$(document).ready(function(e) {
  $("#formConfig").on('submit', async function(e) {
    e.preventDefault();
    const filtroZona = document.getElementById("ParametroZona").value;
    const filtroSecao = document.getElementById("ParametroSecao").value;
    var formData = new FormData(this);
    formData.append("ParametroZona", filtroZona)
    formData.append("ParametroSecao", filtroSecao)
    
    const endPointStatus = "/status";
    const url = host + endPointStatus;
    const requestOptions = {method: 'GET', headers: {'ParametroZona': filtroZona, 'ParametroSecao': filtroSecao}};

    var request = async () => {
      var tmpFetch = await fetch(url, requestOptions)
      .then((response) => response.json())
      .catch(error => console.error(error));
      return tmpFetch;
    };
    var resultPromise = await request('PromiseResult');

    // console.log('resultPromise: ' + JSON.stringify(resultPromise));
    // console.log('resultPromise: ' + resultPromise);
    
    $('#RetornoUploadMessage').text('');
    $('#RetornoUploadError').text('');
    $('#RetornoUploadArquivo').text('');

    var status = JSON.stringify(resultPromise);
    $('#RetornoUploadArquivo').append(status);
    
});
});

