# API Eleições - NodeJS + MongoDB

Módulos npm
- cors
- express
- moment
- multer
- path
- fs
- mongodb
- mongoose

Páginas

- http://apieleicoes.projectdev.services/pages_0_status.html
- http://apieleicoes.projectdev.services/pages_1_config.html
- http://apieleicoes.projectdev.services/pages_2_importacao.html
- http://apieleicoes.projectdev.services/pages_3_acompanhamento.html
- http://apieleicoes.projectdev.services/pages_4_resultados.html

Endpoints

- [GET] http://projectdev.services:3039/status
- [GET] http://projectdev.services:3039/statusdb


User Story 1 - Configuração da Eleição
- [POST] http://projectdev.services:3039/api/eleicao

User Story 2 - Importação de Resultados de Seção
- [POST] http://projectdev.services:3039/api/eleicao/importacoes-secoes

User Story 3 - Acompanhamento das Seções Importadas
- [GET] http://projectdev.services:3039/api/eleicao/importacoes-secoes

User Story 4 - Acompanhamento dos Resultados
- [GET] http://projectdev.services:3039/api/eleicao/resultados