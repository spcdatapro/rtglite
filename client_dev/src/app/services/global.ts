export let GLOBAL = {
    // url: 'http://' + window.location.hostname + ':3789/api/' // Descomentar para servidor de produccion
    url: 'http://' + window.location.hostname + ':4200/api/' // Descomentar para servidor de produccion
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
