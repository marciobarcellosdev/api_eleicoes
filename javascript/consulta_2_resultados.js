$(document).ready(function(e) {
  $("#formConfig").on('submit', async function(e) {
    e.preventDefault();
    const filtroZona = document.getElementById("ParametroZona").value;
    const filtroSecao = document.getElementById("ParametroSecao").value;
    var formData = new FormData(this);
    formData.append("ParametroZona", filtroZona)
    formData.append("ParametroSecao", filtroSecao)
    
    const endPointResultados = "/api/eleicao/resultados";
    const url = host + endPointResultados;
    const requestOptions = {method: 'GET', headers: {'ParametroZona': filtroZona, 'ParametroSecao': filtroSecao}};

    var request = async () => {
      var tmpFetch = await fetch(url, requestOptions)
      .then((response) => response.json())
      .catch(error => console.error(error));
      return tmpFetch;
    };
    var resultPromise = await request('PromiseResult');

    //console.log('resultPromise: ' + JSON.stringify(resultPromise));
    //console.log('resultPromise: ' + resultPromise);
    
    $('#RetornoUploadMessage').text('');
    $('#RetornoUploadError').text('');
    $('#RetornoUploadArquivo').text('');

    if(resultPromise != null){
      var doc = resultPromise[0];
      $('#RetornoUploadArquivo').append('Total votos válidos: ' + doc.totalVotosValidos + '<br>');
      $('#RetornoUploadArquivo').append('Percentual votos válidos: ' + doc.percentualVotosValidos + '<br>');
      $('#RetornoUploadArquivo').append('<br>');
      doc.candidatos.forEach((c) => {
        $('#RetornoUploadArquivo').append('Nome candidato: ' + c.nomeCandidato + '<br>');
        $('#RetornoUploadArquivo').append('Quantidade votos: ' + c.quantidadeVotos + '<br>');
        $('#RetornoUploadArquivo').append('Percentual votos: 33.33 <br>');
        //$('#RetornoUploadArquivo').append('Percentual votos: ' + c.percentualVotosValidos + '<br>');
        $('#RetornoUploadArquivo').append('<br>');
      });


      var data = [{
          values: [doc.totalEleitoresPresentes, doc.totalAbstencoes],
          labels: ['Presentes', 'Abstenções'], 
          type: 'pie', 
          marker: { colors: ['rgb(50,205,50)', 'rgb(255,0,0)']}
          }];
      var layout = {height: 400, width: 500};
      Plotly.newPlot('plot1', data, layout);

    }// if

  });
});

