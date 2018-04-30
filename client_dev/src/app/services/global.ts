export let GLOBAL = {
    url: 'http://' + window.location.hostname + ':3789/api/'
    // url: 'http://' + window.location.hostname + ':4200/api/'
};

export enum EstatusComanda {
    RecibidaRestaurante = 'confcom',
    ConfirmadaEncargado = 'confcomenc',
    CobroAprobado = 'comaprob',
    CobroRechazado = 'comrech',
    Produccion = 'comprod',
    EnCamino = 'comencamino',
    Entregada = 'comentregada',
    ConError = 'comerror'
}
