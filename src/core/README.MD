##### Use Cases
 - `Login` do usuário que usa `repositorio` de usuario e `remote` login;
 - `CadastrarResponsavelPorMatricula` que usa `repositorio` de Responsável e `RemoteCadastroResponsavelPorMatricula`;
 - `CadastrarResponsavelPorCPF` que usa `repositorio` de Responsável e `RemoteCadastroResponsavelPorCPF`;
 - `NovoBO` que salva um BO na lista de BOs locais, usa `repositório` de BO;
 - `EditarTranscricaoFato` que altera a transcrição no BO local, usa `repositório` de BO;
 - `AdicionarEnvolvido` que salva um novo envolvido no BO local, usa `repositório` de BO;
 - `EditarEnvolvido` que altera um envolvido no BO local, usa `repositório` de BO;
 - `RemoveEnvolvido` que remove um envolvido no BO local, usa `repositório` de BO;
 - `AdicionarObjeto` que salva um novo Objeto no BO local, usa `repositório` de BO;
 - `EditarObjeto` que altera um Objeto no BO local, usa `repositório` de BO;
 - `RemoveObjeto` que remove um Objeto no BO local, usa `repositório` de BO;
 - `EditarDadosComplementares` que altera os dados complementares no BO Local, usa `repositório` de BO;
 - `AdicionarResponsavelBOPorMatricula` que adiciona um responsável no BO Local, usa `repositório` e `RemoteBuscaResponsavelPorMatricula`
 - `AdicionarResponsavelBOPorCPF` que adiciona um responsável no BO Local, usa `repositório` e `RemoteBuscaResponsavelPorCPF`
 - `UploadBO` que envia o BO para a API, usa `remoteApiUploadBO` e `repositorio` Local de BO para salvar as modificações;
 - `EncaminhaDP` que encaminha o BO para DP, usa o `repositorio` Local de BO e encaminha direto do App, também faz o update do retorno na DP na base de dados principal;
 - `RefreshBO` que atualiza a lista de BO Local, usa o `repositorio` Local de BO e `remoteListaBOdoUsuario`
 - `BuscaEstatisticas` que busca as estatisticas do sistema em produção exclusivamente, usa `remoteGetEstatistica`
 - `VerificaOcorrencia` que verifica se uma ocorrencia já foi registrada no sistema e se já foi concluida na DP, usa `RemoteCheckOcorrencia`
 - `ComplemetarBOLocal` que abre um BO concluido para ser complementado, usa o `repositório` Local de BO e `RemoteVerificaOcorrencia` para validar se a ocorrencia pode ser complementada
 - `RemoteComplementarBO` que salva um BO no Banco de dados, semelhante ao `UploadBO`
 - `RemoteBuscaBO` que busca um BO no banco de dados dado o id do BO, usa o `repositorio` Local de BO e `RemoteGetBOById`


