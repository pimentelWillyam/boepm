
export default class Config {

  public static APP_VERSION = '1.9.80.1'
  
  public static UPDATE_MESSAGE = 'Uma nova versão do aplicativo está disponível. Por favor, atualize para a versão mais recente para continuar usando o aplicativo sem interrupções.'

  public static DEV = 0

  public static STAGE = 1

  public static HML = 2

  public static PROD = 3

  public static ENVIRONMENT = Config.PROD

  public static urlEnvironments = [
    {
      // DEV
      urlBase: 'http://10.81.110.37:8080',
      apkUrl: 'http://191.252.195.200/boepm-teste.apk',
      oneSignalKey: '0e8edc7a-76ff-47be-bd74-e92685c29064',
      urlAbis:
        'http://abis-gti-stage.apps.ocp-server.ati.pe.gov.br/wsCivil/BuscarPorRG',
      urlInfopol:
        'http://10.238.205.138:8080/api',
    },
    {
      // STAGE
      urlBase: 'http://api-boepm-bids-stage.apps.ocp-server.ati.pe.gov.br',
      apkUrl:
        'http://apk-bids-stage.apps.ocp-server.ati.pe.gov.br/boepm-teste.apk',
      oneSignalKey: '0e8edc7a-76ff-47be-bd74-e92685c29064',
      urlAbis:
        'http://abis-gti-stage.apps.ocp-server.ati.pe.gov.br/wsCivil/BuscarPorRG',
      urlInfopol: 'http://10.238.205.138:8080/api',
    },
    {
      // HOMOLOGAÇÃO
      urlBase: 'http://api-boepm-bids-hml.apps.ocp-server.ati.pe.gov.br',
      apkUrl: 'http://apk-bids-hml.apps.ocp-server.ati.pe.gov.br/boepm-hml.apk',
      oneSignalKey: '0e8edc7a-76ff-47be-bd74-e92685c29064',
      urlAbis:
        'http://abis-gti-hml.apps.ocp-server.ati.pe.gov.br/wsCivil/BuscarPorRG',
      urlInfopol: 'http://10.238.205.138:8080/api',
    },
    {
      // PRODUÇÃO
      urlBase: 'http://api-boepm-bids.apps.ocp-server.ati.pe.gov.br',
      apkUrl: 'http://apk-bids.apps.ocp-server.ati.pe.gov.br/boepm-prod.apk',
      oneSignalKey: '52faad20-315e-4fb7-8343-659125a41631',
      urlAbis:
        'https://abis-gti.apps.ocp-server.ati.pe.gov.br/wsCivil/BuscarPorRG',
      urlInfopol: 'http://10.238.205.138:8080/api',
    },
  ]
}

// 0e8edc7a-76ff-47be-bd74-e92685c29064    OneSignal-hml stage e dev
// 6cbd91f9-2a64-4dec-9704-cc5b5880c4a5    appsds prod
// xxxxx    appsds hml
// appcenter codepush release-react -a bopmpe/bidsBopmpe -d hml1.8.0 -m
// appcenter codepush release-react -a bopmpe/bidsBopmpe -d stage -m
// appcenter codepush release-react -a bopmpe/bidsBopmpe -d prod1.8.0 -m
// bids.boepm.app
// bids.boepm.app.hml
// bids.boepm.app.stage

// appcenter codepush rollback -a bopmpe/bidsBopmpe prod1.8.0 --target-release v28
/**
 * -x | --disabled
 * -m | --mandatory
 */
